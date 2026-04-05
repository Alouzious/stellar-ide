import * as StellarSdk from '@stellar/stellar-sdk'

const NETWORKS = {
  TESTNET: {
    url: 'https://soroban-testnet.stellar.org',
    passphrase: StellarSdk.Networks.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
  },
  MAINNET: {
    url: 'https://soroban-mainnet.stellar.org',
    passphrase: StellarSdk.Networks.PUBLIC,
    horizonUrl: 'https://horizon.stellar.org',
  },
}

export function getServer(network = 'TESTNET') {
  const config = NETWORKS[network] || NETWORKS.TESTNET
  return new StellarSdk.rpc.Server(config.url)
}

export function getHorizon(network = 'TESTNET') {
  const config = NETWORKS[network] || NETWORKS.TESTNET
  return new StellarSdk.Horizon.Server(config.horizonUrl)
}

export async function getBalance(address, network = 'TESTNET') {
  try {
    const horizon = getHorizon(network)
    const account = await horizon.loadAccount(address)
    const native = account.balances.find((b) => b.asset_type === 'native')
    return native ? native.balance : '0'
  } catch {
    return null
  }
}

export async function friendbotFund(address) {
  const url = `https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Friendbot funding failed')
  return response.json()
}

export function getExplorerUrl(network, txHash) {
  const base = network === 'MAINNET'
    ? 'https://stellar.expert/explorer/public/tx'
    : 'https://stellar.expert/explorer/testnet/tx'
  return `${base}/${txHash}`
}

export function getContractExplorerUrl(network, contractId) {
  const base = network === 'MAINNET'
    ? 'https://stellar.expert/explorer/public/contract'
    : 'https://stellar.expert/explorer/testnet/contract'
  return `${base}/${contractId}`
}

// ── Deploy contract using wasm_hash ──────────
export async function deployContractOnChain(
  sourceAccount,
  wasmHash,
  network = 'TESTNET'
) {
  const config = NETWORKS[network] || NETWORKS.TESTNET
  const server = new StellarSdk.rpc.Server(config.url)

  // Load account sequence number
  const account = await server.getAccount(sourceAccount)

  // Build deploy transaction
  const contract = new StellarSdk.Contract(wasmHash)
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.passphrase,
  })
    .addOperation(
      StellarSdk.Operation.invokeHostFunction({
        func: StellarSdk.xdr.HostFunction.hostFunctionTypeCreateContract(
          new StellarSdk.xdr.CreateContractArgs({
            contractIdPreimage:
              StellarSdk.xdr.ContractIdPreimage.contractIdPreimageFromAddress(
                new StellarSdk.xdr.ContractIdPreimageFromAddress({
                  address: StellarSdk.Address.fromString(sourceAccount).toScAddress(),
                  salt: Buffer.alloc(32),
                })
              ),
            executable: StellarSdk.xdr.ContractExecutable.contractExecutableWasm(
              Buffer.from(wasmHash, 'hex')
            ),
          })
        ),
        auth: [],
      })
    )
    .setTimeout(180)
    .build()

  // Simulate to get footprint
  const simResult = await server.simulateTransaction(tx)
  if (StellarSdk.rpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`)
  }

  // Assemble final transaction
  const assembled = StellarSdk.rpc.assembleTransaction(tx, simResult).build()
  return assembled.toXDR()
}

// ── Submit signed transaction ─────────────────
export async function submitSignedTransaction(signedXdr, network = 'TESTNET') {
  const config = NETWORKS[network] || NETWORKS.TESTNET
  const server = new StellarSdk.rpc.Server(config.url)
  const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, config.passphrase)
  const result = await server.sendTransaction(tx)

  if (result.status === 'ERROR') {
    throw new Error(`Transaction failed: ${result.errorResult}`)
  }

  // Poll for completion
  let getResult = await server.getTransaction(result.hash)
  let attempts = 0
  while (getResult.status === 'NOT_FOUND' && attempts < 30) {
    await new Promise(r => setTimeout(r, 1000))
    getResult = await server.getTransaction(result.hash)
    attempts++
  }

  if (getResult.status === 'SUCCESS') {
    // Extract contract ID from result
    const contractId = getResult.resultMetaXdr
      ? extractContractId(getResult.resultMetaXdr)
      : null
    return { txHash: result.hash, contractId }
  }

  throw new Error(`Transaction failed with status: ${getResult.status}`)
}

function extractContractId(resultMetaXdr) {
  try {
    const meta = StellarSdk.xdr.TransactionMeta.fromXDR(resultMetaXdr, 'base64')
    const ops = meta.v3().sorobanMeta()?.returnValue()
    if (ops) {
      const addr = StellarSdk.Address.fromScVal(ops)
      return addr.toString()
    }
  } catch {
    return null
  }
}

// ── Upload WASM + Deploy contract ─────────────
// ── Upload WASM + Deploy contract ─────────────
export async function uploadAndDeployWasm(wasmBase64, sourceAccount, network = 'TESTNET', signFn) {
  const config = NETWORKS[network] || NETWORKS.TESTNET
  const server = new StellarSdk.rpc.Server(config.url)

  // Decode base64 WASM
  const wasmBytes = Uint8Array.from(atob(wasmBase64), c => c.charCodeAt(0))

  // Load account
  const account = await server.getAccount(sourceAccount)

  // Step 1 — Upload WASM
  const uploadTx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.passphrase,
  })
    .addOperation(StellarSdk.Operation.uploadContractWasm({ wasm: wasmBytes }))
    .setTimeout(180)
    .build()

  const uploadSim = await server.simulateTransaction(uploadTx)
  if (StellarSdk.rpc.Api.isSimulationError(uploadSim)) {
    throw new Error(`Upload simulation failed: ${uploadSim.error}`)
  }
  const uploadAssembled = StellarSdk.rpc.assembleTransaction(uploadTx, uploadSim).build()
  const signedUploadXdr = await signFn(uploadAssembled.toXDR())
  const uploadResult = await submitAndWait(server, signedUploadXdr, config.passphrase)

  // Extract wasm hash from upload result
  const wasmHash = uploadResult.returnValue
    ? StellarSdk.xdr.ScVal.fromXDR(uploadResult.returnValue, 'base64').bytes().toString('hex')
    : null
  if (!wasmHash) throw new Error('Failed to get wasm hash from upload')

  // Step 2 — Deploy contract using wasm hash
  const account2 = await server.getAccount(sourceAccount)
  const salt = crypto.getRandomValues(new Uint8Array(32))
  const deployTx = new StellarSdk.TransactionBuilder(account2, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.passphrase,
  })
    .addOperation(StellarSdk.Operation.createCustomContract({
      address: new StellarSdk.Address(sourceAccount),
      wasmHash: Buffer.from(wasmHash, 'hex'),
      salt,
    }))
    .setTimeout(180)
    .build()

  const deploySim = await server.simulateTransaction(deployTx)
  if (StellarSdk.rpc.Api.isSimulationError(deploySim)) {
    throw new Error(`Deploy simulation failed: ${deploySim.error}`)
  }
  const deployAssembled = StellarSdk.rpc.assembleTransaction(deployTx, deploySim).build()
  const signedDeployXdr = await signFn(deployAssembled.toXDR())
  const deployResult = await submitAndWait(server, signedDeployXdr, config.passphrase)

  // Extract contract ID
  const contractId = deployResult.returnValue
    ? StellarSdk.Address.fromScVal(
        StellarSdk.xdr.ScVal.fromXDR(deployResult.returnValue, 'base64')
      ).toString()
    : null

  return { contractId, txHash: deployResult.txHash }
}

async function submitAndWait(server, signedXdr, passphrase) {
  const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, passphrase)
  const sent = await server.sendTransaction(tx)
  if (sent.status === 'ERROR') {
    throw new Error(`Transaction failed: ${JSON.stringify(sent.errorResult)}`)
  }
  let result = await server.getTransaction(sent.hash)
  let attempts = 0
  while (result.status === 'NOT_FOUND' && attempts < 30) {
    await new Promise(r => setTimeout(r, 1000))
    result = await server.getTransaction(sent.hash)
    attempts++
  }
  if (result.status !== 'SUCCESS') {
    throw new Error(`Transaction failed with status: ${result.status}`)
  }
  return { ...result, txHash: sent.hash }
}

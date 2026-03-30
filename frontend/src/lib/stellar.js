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

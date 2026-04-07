import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit'
import { FreighterModule, FREIGHTER_ID } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { LobstrModule, LOBSTR_ID } from '@creit.tech/stellar-wallets-kit/modules/lobstr'

let initialized = false

function ensureInit(network = 'TESTNET') {
  if (!initialized) {
    StellarWalletsKit.init({
      network: network === 'MAINNET' ? Networks.PUBLIC : Networks.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: [new FreighterModule(), new LobstrModule()],
    })
    initialized = true
  }
}

export async function connectWallet(walletId = FREIGHTER_ID, network = 'TESTNET') {
  ensureInit(network)
  StellarWalletsKit.setWallet(walletId)
  const result = await StellarWalletsKit.selectedModule.getAddress({ skipRequestAccess: false })
  return result?.address || result
}

export async function signTransaction(xdr, network = 'TESTNET') {
  ensureInit(network)
  const passphrase = network === 'MAINNET'
    ? 'Public Global Stellar Network ; September 2015'
    : 'Test SDF Network ; September 2015'
  const result = await StellarWalletsKit.selectedModule.signTransaction(xdr, {
    networkPassphrase: passphrase,
  })
  return result.signedTxXdr
}

export { FREIGHTER_ID, LOBSTR_ID }

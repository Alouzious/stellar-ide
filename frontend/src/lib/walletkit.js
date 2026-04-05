import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit'
import { FreighterModule, FREIGHTER_ID } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import { LobstrModule, LOBSTR_ID } from '@creit.tech/stellar-wallets-kit/modules/lobstr'

const MODULES = [
  new FreighterModule(),
  new xBullModule(),
  new LobstrModule(),
]

let initialized = false

function ensureInit(network = 'TESTNET') {
  if (!initialized) {
    StellarWalletsKit.init({
      network: network === 'MAINNET' ? Networks.PUBLIC : Networks.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: MODULES,
    })
    initialized = true
  }
}

export async function connectWallet(walletId = FREIGHTER_ID, network = 'TESTNET') {
  ensureInit(network)
  StellarWalletsKit.setWallet(walletId)
  // Use selectedModule to directly request access from the wallet
  const result = await StellarWalletsKit.selectedModule.getAddress({ skipRequestAccess: false })
  return result?.address || result
}

export async function signTransaction(xdr, network = 'TESTNET') {
  ensureInit(network)
  const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase: network === 'MAINNET'
      ? 'Public Global Stellar Network ; September 2015'
      : 'Test SDF Network ; September 2015',
  })
  return signedTxXdr
}

export { FREIGHTER_ID, LOBSTR_ID }

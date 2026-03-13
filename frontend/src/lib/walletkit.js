import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit'
import { FreighterModule, FREIGHTER_ID } from '@creit.tech/stellar-wallets-kit/modules/freighter'
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull'
import { LobstrModule, LOBSTR_ID } from '@creit.tech/stellar-wallets-kit/modules/lobstr'

const MODULES = [
  new FreighterModule(),
  new xBullModule(),
  new LobstrModule(),
]

export function initKit(network = 'TESTNET') {
  // StellarWalletsKit v2 uses static methods; instantiation registers modules
  new StellarWalletsKit({
    network: network === 'MAINNET' ? Networks.PUBLIC : Networks.TESTNET,
    selectedWalletId: FREIGHTER_ID,
    modules: MODULES,
  })
}

export async function connectWallet(walletId = FREIGHTER_ID, network = 'TESTNET') {
  initKit(network)
  StellarWalletsKit.setWallet(walletId)
  const result = await StellarWalletsKit.getAddress()
  return result?.address || result
}

export async function signTransaction(xdr, network = 'TESTNET') {
  const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase: network === 'MAINNET'
      ? 'Public Global Stellar Network ; September 2015'
      : 'Test SDF Network ; September 2015',
  })
  return signedTxXdr
}

export { FREIGHTER_ID, LOBSTR_ID }

export function generateTypeScriptClient(contractId, abi, network = 'TESTNET') {
  const networkPassphrase = network === 'MAINNET'
    ? 'Public Global Stellar Network ; September 2015'
    : 'Test SDF Network ; September 2015'

  const rpcUrl = network === 'MAINNET'
    ? 'https://soroban-mainnet.stellar.org'
    : 'https://soroban-testnet.stellar.org'

  const functions = abi?.functions || []
  const methodSignatures = functions.map((fn) => {
    const params = (fn.inputs || []).map((p) => `${p.name}: ${sorobanTypeToTS(p.type)}`).join(', ')
    const returnType = sorobanTypeToTS(fn.output)
    return `  async ${fn.name}(${params}): Promise<${returnType}>`
  }).join('\n')

  return `// Auto-generated TypeScript client for StellarIDE
// Contract: ${contractId}
// Network: ${network}
// Generated: ${new Date().toISOString()}

import * as StellarSdk from '@stellar/stellar-sdk'

const CONTRACT_ID = '${contractId}'
const NETWORK_PASSPHRASE = '${networkPassphrase}'
const RPC_URL = '${rpcUrl}'

export class ContractClient {
  private server: StellarSdk.rpc.Server
  private contractId: string

  constructor(contractId = CONTRACT_ID) {
    this.server = new StellarSdk.rpc.Server(RPC_URL)
    this.contractId = contractId
  }

${methodSignatures || '  // No functions found in ABI'}
}

export const contract = new ContractClient()
export default contract
`
}

function sorobanTypeToTS(type) {
  if (!type) return 'unknown'
  const typeMap = {
    'u32': 'number',
    'i32': 'number',
    'u64': 'bigint',
    'i64': 'bigint',
    'u128': 'bigint',
    'i128': 'bigint',
    'bool': 'boolean',
    'symbol': 'string',
    'string': 'string',
    'address': 'string',
    'bytes': 'Uint8Array',
    'void': 'void',
  }
  return typeMap[type] || 'StellarSdk.xdr.ScVal'
}

export function generateAbiJson(functions) {
  return JSON.stringify({ version: '1', functions: functions || [] }, null, 2)
}

import { FileCode, Plus, Clock, ChevronRight } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { Button } from '@/components/ui/Button'

const TEMPLATES = [
  { id: 'hello', name: 'Hello World', description: 'Basic contract' },
  { id: 'token', name: 'Token (SEP-41)', description: 'Fungible token' },
  { id: 'storage', name: 'Storage', description: 'Persistent storage' },
  { id: 'escrow', name: 'Escrow', description: 'Conditional payments' },
  { id: 'nft', name: 'NFT', description: 'Non-fungible token' },
  { id: 'voting', name: 'Voting', description: 'On-chain governance' },
  { id: 'timelock', name: 'Timelock', description: 'Time-locked actions' },
  { id: 'multisig', name: 'Multisig', description: 'Multi-signature wallet' },
  { id: 'oracle', name: 'Oracle', description: 'Price feed oracle' },
  { id: 'dao', name: 'DAO', description: 'Decentralized org' },
]

const TEMPLATE_CODE = {
  hello: `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }
}`,
  token: `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String};

#[contract]
pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String, decimals: u32) {
        admin.require_auth();
        // TODO: initialize token storage
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        // TODO: read balance from storage
        0
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        // TODO: transfer logic
    }
}`,
  storage: `#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, Val};

const KEY: Symbol = soroban_sdk::symbol_short!("DATA");

#[contract]
pub struct StorageContract;

#[contractimpl]
impl StorageContract {
    pub fn set(env: Env, value: Val) {
        env.storage().persistent().set(&KEY, &value);
    }

    pub fn get(env: Env) -> Option<Val> {
        env.storage().persistent().get(&KEY)
    }
}`,
}

export function CreatePanel() {
  const { setCode, addFile, setActiveFile, files } = useEditorStore()

  const loadTemplate = (templateId) => {
    const code = TEMPLATE_CODE[templateId] || TEMPLATE_CODE.hello
    setCode(code)
  }

  const newBlankContract = () => {
    setCode(`#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct MyContract;

#[contractimpl]
impl MyContract {
    // Add your contract functions here
}`)
  }

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        size="sm"
        icon={Plus}
        onClick={newBlankContract}
        className="w-full justify-center"
      >
        New Blank Contract
      </Button>

      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Templates</h3>
        <div className="space-y-1">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => loadTemplate(t.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-left hover:bg-bg-hover transition-colors group"
            >
              <div className="flex items-center gap-2">
                <FileCode size={13} className="text-accent-blue flex-shrink-0" />
                <div>
                  <div className="text-xs text-text-primary">{t.name}</div>
                  <div className="text-xs text-text-muted">{t.description}</div>
                </div>
              </div>
              <ChevronRight size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          <Clock size={11} className="inline mr-1" />Open Files
        </h3>
        <div className="space-y-1">
          {Object.keys(files).map((filename) => (
            <button
              key={filename}
              onClick={() => setActiveFile(filename)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-left hover:bg-bg-hover transition-colors"
            >
              <FileCode size={12} className="text-text-muted flex-shrink-0" />
              <span className="text-xs text-text-secondary">{filename}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

import { create } from 'zustand'

const DEFAULT_HELLO_WORLD_CONTRACT = `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{symbol_short, vec, Env};

    #[test]
    fn test_hello() {
        let env = Env::default();
        let contract_id = env.register_contract(None, HelloContract);
        let client = HelloContractClient::new(&env, &contract_id);

        let words = client.hello(&symbol_short!("Dev"));
        assert_eq!(
            words,
            vec![&env, symbol_short!("Hello"), symbol_short!("Dev"),]
        );
    }
}
`

const DEFAULT_CARGO_TOML = `[package]
name = "hello_world"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
soroban-sdk = { version = "21.0.0", features = ["alloc"] }

[dev-dependencies]
soroban-sdk = { version = "21.0.0", features = ["testutils"] }

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true

[profile.release-with-logs]
inherits = "release"
debug-assertions = true
`

const DEFAULT_FILES = {
  'lib.rs': DEFAULT_HELLO_WORLD_CONTRACT,
  'Cargo.toml': DEFAULT_CARGO_TOML,
}

export const useEditorStore = create((set, get) => ({
  code: DEFAULT_HELLO_WORLD_CONTRACT,
  activeFile: 'lib.rs',
  // files holds the current (possibly unsaved) editor content per file
  files: { ...DEFAULT_FILES },
  // savedFiles tracks the last explicitly saved content per file
  savedFiles: { ...DEFAULT_FILES },
  isDirty: false,

  setCode: (code) => {
    const { activeFile, savedFiles } = get()
    set((state) => ({
      code,
      isDirty: code !== savedFiles[activeFile],
      files: { ...state.files, [activeFile]: code },
    }))
  },

  setActiveFile: (file) => {
    const { files, savedFiles } = get()
    set({ activeFile: file, code: files[file] || '', isDirty: (files[file] || '') !== (savedFiles[file] || '') })
  },

  saveFile: () => {
    const { activeFile, code, savedFiles } = get()
    set({ savedFiles: { ...savedFiles, [activeFile]: code }, isDirty: false })
  },

  addFile: (filename, content = '') => {
    set((state) => ({
      files: { ...state.files, [filename]: content },
      savedFiles: { ...state.savedFiles, [filename]: content },
    }))
  },

  removeFile: (filename) => {
    const { files, savedFiles, activeFile } = get()
    const newFiles = { ...files }
    const newSavedFiles = { ...savedFiles }
    delete newFiles[filename]
    delete newSavedFiles[filename]
    const newActive = activeFile === filename ? Object.keys(newFiles)[0] || '' : activeFile
    set({
      files: newFiles,
      savedFiles: newSavedFiles,
      activeFile: newActive,
      code: newFiles[newActive] || '',
      isDirty: false,
    })
  },
}))

// ============================================
// StellarIDE — TypeScript Client Generator
// Generates TS/JS client from contract ABI
// ============================================

use serde_json::Value;
use crate::errors::AppResult;

pub fn generate_ts_client(contract_id: &str, network: &str, abi: &Value) -> AppResult<String> {
    let network_url = match network {
        "mainnet" => "https://soroban-rpc.mainnet.stellar.gateway.fm",
        "testnet" => "https://soroban-testnet.stellar.org",
        _         => "https://soroban-testnet.stellar.org",
    };

    let functions = extract_functions(abi);
    let methods = generate_methods(&functions);

    let client = format!(
        r#"// ================================================
// StellarIDE — Auto-generated TypeScript Client
// Contract: {contract_id}
// Network:  {network}
// ================================================

import {{ Contract, SorobanRpc, TransactionBuilder, Networks, BASE_FEE }} from "@stellar/stellar-sdk";

const CONTRACT_ID = "{contract_id}";
const RPC_URL     = "{network_url}";

export class {class_name}Client {{
  private contract: Contract;
  private server: SorobanRpc.Server;

  constructor() {{
    this.contract = new Contract(CONTRACT_ID);
    this.server   = new SorobanRpc.Server(RPC_URL);
  }}

{methods}
}}

export default new {class_name}Client();
"#,
        contract_id = contract_id,
        network = network,
        network_url = network_url,
        class_name = to_class_name(contract_id),
        methods = methods,
    );

    Ok(client)
}

fn extract_functions(abi: &Value) -> Vec<(String, Vec<String>)> {
    let mut functions = Vec::new();

    if let Some(fns) = abi.get("functions").and_then(|f| f.as_array()) {
        for func in fns {
            if let Some(name) = func.get("name").and_then(|n| n.as_str()) {
                let params: Vec<String> = func
                    .get("inputs")
                    .and_then(|i| i.as_array())
                    .map(|inputs| {
                        inputs
                            .iter()
                            .filter_map(|p| p.get("name").and_then(|n| n.as_str()))
                            .map(|n| format!("{}: unknown", n))
                            .collect()
                    })
                    .unwrap_or_default();

                functions.push((name.to_string(), params));
            }
        }
    }

    functions
}

fn generate_methods(functions: &[(String, Vec<String>)]) -> String {
    if functions.is_empty() {
        return "  // No functions found in ABI\n".to_string();
    }

    functions
        .iter()
        .map(|(name, params)| {
            let param_list = params.join(", ");
            format!(
                "  async {name}({param_list}): Promise<unknown> {{\n    // TODO: implement {name}\n    throw new Error(\"Not implemented\");\n  }}\n",
                name = name,
                param_list = param_list,
            )
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn to_class_name(contract_id: &str) -> String {
    format!("Contract{}", &contract_id[..8.min(contract_id.len())])
}

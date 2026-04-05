FROM rust:1.88-slim
ENV CARGO_HOME=/mnt/cargo
ENV CARGO_TARGET_DIR=/mnt/cargo/target
ENV PATH=/mnt/cargo/bin:/usr/local/cargo/bin:${PATH}

RUN apt-get update && apt-get install -y \
    pkg-config libssl-dev curl clang lld build-essential libdbus-1-3 \
    && rm -rf /var/lib/apt/lists/*
RUN rustup target add wasm32-unknown-unknown && \
    rustup target add wasm32v1-none
COPY sandbox/stellar-cli.tar.gz ./
RUN tar -xzf stellar-cli.tar.gz \
    && mv stellar /usr/local/bin/stellar \
    && chmod +x /usr/local/bin/stellar \
    && rm stellar-cli.tar.gz \
    && stellar --version
COPY sandbox/test.sh  /usr/local/bin/test.sh
COPY sandbox/build.sh /usr/local/bin/build.sh
COPY sandbox/audit.sh /usr/local/bin/audit.sh
RUN chmod +x /usr/local/bin/test.sh /usr/local/bin/build.sh /usr/local/bin/audit.sh
RUN mkdir -p /mnt/cargo/target && mkdir -p /prebake/src
RUN printf '[package]\nname = "prebake"\nversion = "0.1.0"\nedition = "2021"\npublish = false\n\n[lib]\ncrate-type = ["cdylib"]\n\n[dependencies]\nsoroban-sdk = { version = "22.0.0", features = ["alloc"] }\n\n[dev-dependencies]\nsoroban-sdk = { version = "22.0.0", features = ["testutils", "alloc"] }\n\n[profile.release]\nopt-level = "z"\noverflow-checks = true\ndebug = 0\nstrip = "symbols"\ndebug-assertions = false\npanic = "abort"\ncodegen-units = 1\nlto = true\n' > /prebake/Cargo.toml
RUN printf '#![cfg_attr(target_family = "wasm", no_std)]\nuse soroban_sdk::{contract, contractimpl, Env};\n\n#[contract]\npub struct PreBake;\n\n#[contractimpl]\nimpl PreBake {\n    pub fn hello(_env: Env) -> u32 { 42 }\n}\n' > /prebake/src/lib.rs
WORKDIR /prebake
RUN cargo fetch
RUN cargo build 2>&1
RUN cargo build --target wasm32-unknown-unknown --release 2>&1
RUN useradd -m -u 1001 sandboxuser
WORKDIR /workspace
USER sandboxuser
CMD ["/bin/bash"]

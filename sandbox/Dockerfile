FROM rust:1.88-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    curl \
    libdbus-1-3 \
    && rm -rf /var/lib/apt/lists/*

RUN rustup target add wasm32-unknown-unknown
RUN rustup target add wasm32v1-none

COPY stellar-cli.tar.gz ./
RUN tar -xzf stellar-cli.tar.gz \
    && mv stellar /usr/local/bin/stellar \
    && chmod +x /usr/local/bin/stellar \
    && rm stellar-cli.tar.gz

# Pre-cache soroban dependencies
RUN mkdir -p /cache/src && \
    echo '[package]\nname = "cache"\nversion = "0.1.0"\nedition = "2021"\n\n[lib]\ncrate-type = ["cdylib"]\n\n[dependencies]\nsoroban-sdk = { version = "22.0.0", features = ["alloc"] }\n\n[dev-dependencies]\nsoroban-sdk = { version = "22.0.0", features = ["testutils", "alloc"] }' > /cache/Cargo.toml && \
    echo '#![no_std]\nuse soroban_sdk::{contract, contractimpl, Env};\n#[contract]\npub struct C;\n#[contractimpl]\nimpl C {}' > /cache/src/lib.rs && \
    cd /cache && \
    stellar contract build 2>&1 || true && \
    cargo test 2>&1 || true

COPY audit.sh build.sh test.sh ./
RUN chmod +x audit.sh build.sh test.sh

WORKDIR /workspace

# Aeternum Infrastructure

[![Lint](https://github.com/Aeternumlabs/aeternum-infra/actions/workflows/lint.yml/badge.svg)](https://github.com/Aeternumlabs/aeternum-infra/actions/workflows/lint.yml) 
[![Tests](https://github.com/Aeternumlabs/aeternum-infra/actions/workflows/test.yml/badge.svg)](https://github.com/Aeternumlabs/aeternum-infra/actions/workflows/test.yml)

This repo houses the off-chain infrastructure powering the Aeternum protocol, including indexing, automation, monitoring, and supporting backend services.

---

## Folder structure

```
aeternum-infra/
│
├── apps/
│   │
│   ├── indexer/                          ← migrated from aeternum-indexer
│   │
│   ├── keeper/                           ← new — Aeternum Labs keeper bot
│   │
│   └── notifications/                    ← stub — not yet implemented
│
├── packages/
│   │
│   ├── blockchain/                       ← ABI, viem clients, contract addresses
│   │   ├── src/
│   │   │   ├── index.ts                  ← barrel export
│   │   │   ├── abi.ts                    ← AeternumVault ABI (migrated from indexer)
│   │   │   ├── addresses.ts              ← contract address per network
│   │   │   └── client.ts                 ← viem publicClient + walletClient factory
│   │   ├── package.json
│   │   └── tsconfig.json                 ← extends ../../tsconfig.json
│   │
│   ├── db/                               ← database client + shared query helpers
│   │   ├── src/
│   │   │   ├── index.ts                  ← barrel export
│   │   │   ├── client.ts                 ← postgres client instance
│   │   │   └── queries.ts                ← shared query helpers (due vaults, etc.)
│   │   ├── package.json
│   │   └── tsconfig.json                 ← extends ../../tsconfig.json
│   │
│   └── config/                           ← env validation + shared constants
│       ├── src/
│       │   ├── index.ts                  ← barrel export
│       │   ├── env.ts                    ← zod env schema, validated at startup
│       │   └── constants.ts              ← chain IDs, timing constants, network names
│       ├── package.json
│       └── tsconfig.json                 ← extends ../../tsconfig.json
│
├── .env.example                          ← root-level shared env vars
├── .gitignore
├── package.json                          ← workspace root, no source
├── pnpm-lock.yaml
├── pnpm-workspace.yaml                   ← declares apps/* and packages/*
├── README.md
├── tsconfig.json                         ← base config extended by all apps/packages
└── turbo.json                            ← build pipeline + task dependency graph
```
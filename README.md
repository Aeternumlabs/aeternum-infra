# Aeternum Infrastructure

This repo houses the off-chain infrastructure powering the Aeternum protocol, including indexing, automation, monitoring, and supporting backend services.

---

## Folder structure

```
aeternum-infra/
│
├── apps/
│   │
│   ├── indexer/                          ← migrated from aeternum-indexer
│   │   ├── generated/
│   │   │   └── schema.graphql            ← Ponder-generated, do not edit manually
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   └── index.ts              ← Ponder's built-in Hono API layer
│   │   │   └── index.ts                  ← Ponder event handlers
│   │   ├── .env.example                  ← indexer-specific env vars
│   │   ├── package.json
│   │   ├── ponder-env.d.ts               ← Ponder type declarations
│   │   ├── ponder.config.ts              ← chain + contract configuration
│   │   ├── ponder.schema.ts              ← database schema definitions
│   │   ├── railway.toml                  ← indexer-specific Railway config
│   │   └── tsconfig.json                 ← extends ../../tsconfig.json
│   │
│   ├── keeper/                           ← new — Aeternum Labs keeper bot
│   │   ├── src/
│   │   │   ├── index.ts                  ← entry point, main polling loop
│   │   │   ├── scanner.ts                ← calls getTriggerableVaultsBatch
│   │   │   ├── executor.ts               ← submits triggerRecovery via Multicall3
│   │   │   └── logger.ts                 ← structured logging
│   │   ├── .env.example                  ← keeper-specific env vars
│   │   ├── package.json
│   │   ├── railway.toml                  ← keeper-specific Railway config
│   │   └── tsconfig.json                 ← extends ../../tsconfig.json
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
├── .nvmrc                                ← 22
├── package.json                          ← workspace root, no source
├── pnpm-lock.yaml
├── pnpm-workspace.yaml                   ← declares apps/* and packages/*
├── README.md
├── tsconfig.json                         ← base config extended by all apps/packages
└── turbo.json                            ← build pipeline + task dependency graph
```
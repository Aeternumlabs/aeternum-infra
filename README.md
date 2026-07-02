# Aeternum Infrastructure

[![Lint](https://github.com/Aeternumlabs/aeternum-infra/actions/workflows/lint.yml/badge.svg)](https://github.com/Aeternumlabs/aeternum-infra/actions/workflows/lint.yml) 
[![Tests](https://github.com/Aeternumlabs/aeternum-infra/actions/workflows/test.yml/badge.svg)](https://github.com/Aeternumlabs/aeternum-infra/actions/workflows/test.yml)

This repo houses the off-chain infrastructure powering the Aeternum protocol, including indexing, automation, monitoring, and supporting backend services.

## Apps

- **indexer** — On-chain event indexer for AeternumVault contract with GraphQL + REST API
- **keeper** — Automated recovery bot that scans for due vaults and executes recoveries
- **notifications** — (coming soon) Notification service for protocol events

## Packages

- **blockchain** — Contract ABIs, viem client factories, and network addresses
- **db** — PostgreSQL client and shared query helpers
- **config** — Environment validation with Zod and shared constants

## Folder structure

```
aeternum-infra/
│
├── apps/
│   │
│   ├── indexer/                          ← Ponder-based event indexer
│   │   ├── .env.example                  ← indexer-specific env vars
│   │   ├── package.json
│   │   ├── ponder.config.ts              ← chain + contract configuration
│   │   ├── ponder.schema.ts              ← database schema definitions
│   │   ├── railway.toml                  ← indexer-specific Railway config
│   │   ├── README.md                     ← indexer documentation
│   │   ├── src/                          ← source code
│   │   └── tsconfig.json                 ← extends ../../tsconfig.json
│   │
│   ├── keeper/                           ← Automated recovery bot
│   │   ├── .env.example                  ← keeper-specific env vars
│   │   ├── package.json
│   │   ├── railway.toml                  ← keeper-specific Railway config
│   │   ├── README.md                     ← keeper documentation
│   │   ├── src/                          ← source code
│   │   ├── test/                         ← unit + integration tests
│   │   ├── vitest.config.ts              ← test configuration
│   │   └── tsconfig.json                 ← extends ../../tsconfig.json
│   │
│   └── notifications/                    ← stub — not yet implemented
│
├── packages/
│   │
│   ├── blockchain/                       ← ABI, viem clients, contract addresses
│   │   ├── src/
│   │   │   ├── index.ts                  ← barrel export
│   │   │   ├── abi.ts                    ← AeternumVault and Multicall3 ABIs
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

## Setup

```bash
pnpm install
```

## Commands

```bash
pnpm dev          # Start all apps in dev mode
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm test         # Run all tests
pnpm format       # Format code with Prettier
```

## Notes

- Uses pnpm workspaces for monorepo management
- Turbo handles build pipeline and task orchestration
- Shared environment variables are in root `.env.local`
- App-specific environment variables are in each app's `.env.local`
- See individual app READMEs for detailed setup and configuration
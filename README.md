# Aeternum Infrastructure

This repo houses the off-chain infrastructure powering the Aeternum protocol, including indexing, automation, monitoring, and supporting backend services.

---

## Folder structure

```
aeternum-infra/
├── apps/
│   ├── indexer/            ← migrated from aeternum-indexer
│   │   ├── abis/           ← remove after moving to packages/blockchain
│   │   ├── src/
│   │   │   ├── api/        ← Ponder's API layer, stays here
│   │   │   └── index.ts
│   │   ├── ponder.config.ts
│   │   ├── ponder.schema.ts
│   │   └── railway.toml    ← app-specific
│   ├── keeper/
│   │   └── railway.toml    ← app-specific
│   └── notifications/      ← stub for now
├── packages/
│   ├── blockchain/         ← ABI, viem client, addresses
│   ├── db/                 ← database client, re-exported Ponder types
│   └── config/             ← env validation, shared constants
├── .nvmrc                  ← 22
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── .env.example

```
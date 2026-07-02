# Aeternum Indexer

On-chain event indexer for the AeternumVault smart contract. Built with Ponder, it indexes vault lifecycle events, stores normalized state in a PostgreSQL database, and exposes GraphQL and REST query endpoints.

## Features

- Indexes AeternumVault contract events on Sepolia
- Stores vault state, transaction history, and recovery lifecycle events
- Exposes auto-generated GraphQL API
- Provides custom REST endpoints
- Environment-driven configuration for RPC and contract addresses

## Schema

- **vaults** — Core vault entity with registration and state metadata
- **vault_transactions** — deposits, withdrawals, transfers
- **recovery_events** — executed, failed, abandoned, cancelled recoveries

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables in `.env.local`:

```bash
CHAIN_ID=11155111
RPC_URL=YourSepoliaRpcUrl
CONTRACT_ADDRESS=0xYourContractAddressHere
CONTRACT_DEPLOY_BLOCK=BlockNumber
DATABASE_URL=YourDatabaseUrl
```

## Scripts

```bash
cd apps/indexer
pnpm dev          # Start indexer in dev mode
pnpm build        # Build indexer package
pnpm start        # Start indexer in production mode
pnpm codegen      # Generate schema/type artifacts
```

## Configuration

- **Chain**: Sepolia (ID: 11155111)
- **RPC**: Configured via `RPC_URL` env var
- **Rate limit**: 10 requests/second
- **Block range**: 1000 blocks per log fetch
- **Contract**: AeternumVault address from `CONTRACT_ADDRESS`
- **Start block**: Indexing starts from block `11140604`

## API

The GraphQL API is exposed at:
- `/`
- `/graphql`

Custom REST endpoints are available via Hono.

## Notes

- Event handlers are in `src/index.ts`
- API routes are in `src/api/`
- Database schema is defined in `ponder.schema.ts`
- Chain and contract configuration is in `ponder.config.ts`

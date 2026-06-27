export { createDbClient } from "./client.js";
export type { DbClient } from "./client.js";

export {
  vaults,
  vaultTransactions,
  balanceEvents,
  getDueVaults,
  getVaultByAddress,
  getActiveVaultCount,
} from "./queries.js";

export type {
  Vault,
  VaultTransaction,
  BalanceEvent,
} from "./queries.js";
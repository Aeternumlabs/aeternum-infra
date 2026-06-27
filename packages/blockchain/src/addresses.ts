/**
 * src/addresses.ts
 *
 * Known AeternumVault deployment addresses per network.
 *
 * This record is the static source of truth for tooling, scripts, and
 * documentation. At runtime, both the indexer (ponder.config.ts) and the
 * keeper read the address from env.CONTRACT_ADDRESS — which must match the
 * entry for the active network here.
 *
 * When a new network is deployed, add its entry and update CONTRACT_ADDRESS
 * in the relevant .env file.
 */

import { CHAIN_IDS } from "@aeternum/config";

export const AETERNUM_VAULT_ADDRESSES: Partial<Record<number, `0x${string}`>> =
  {
    [CHAIN_IDS.SEPOLIA]: "0x9Eb95e4b47aECCB131f20AE7af33A29832499067",
    // [CHAIN_IDS.MAINNET]: "0x..." — add after mainnet deployment
  };

/**
 * Returns the deployed AeternumVault address for a given chain ID.
 * Throws if no address is registered for the chain.
 *
 * @param chainId  The numeric EVM chain ID.
 */
export function getVaultAddress(chainId: number): `0x${string}` {
  const address = AETERNUM_VAULT_ADDRESSES[chainId];
  if (!address) {
    throw new Error(
      `No AeternumVault address registered for chainId ${chainId}. ` +
      `Add it to AETERNUM_VAULT_ADDRESSES in packages/blockchain/src/addresses.ts.`,
    );
  }
  return address;
}
import type { Address } from "viem";

import { CHAIN_IDS } from "@aeternum/config";

export const vaultAddresses: Record<number, Address> = {
  [CHAIN_IDS.sepolia]: (process.env.NEXT_PUBLIC_VAULT_ADDRESS ??
    "0x0000000000000000000000000000000000000000") as Address,
};

export function getVaultAddress(chainId: number): Address {
  const address = vaultAddresses[chainId];
  if (!address) {
    throw new Error(`No vault address configured for chain ${chainId}`);
  }
  return address;
}

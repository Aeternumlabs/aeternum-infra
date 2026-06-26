import type { Address, PublicClient } from "viem";

import {
  AETERNUM_VAULT_ABI,
  getVaultAddress,
} from "@aeternum/blockchain";
import { CHAIN_IDS } from "@aeternum/config";

export async function scanTriggerableVaults(
  publicClient: PublicClient,
  batchSize: number,
): Promise<Address[]> {
  const vaultAddress = getVaultAddress(CHAIN_IDS.sepolia);
  const totalRegistered = await publicClient.readContract({
    address: vaultAddress,
    abi: AETERNUM_VAULT_ABI,
    functionName: "getTotalRegistered",
  });

  const triggerable: Address[] = [];

  for (let startIndex = 0n; startIndex < totalRegistered; startIndex += BigInt(batchSize)) {
    const batch = await publicClient.readContract({
      address: vaultAddress,
      abi: AETERNUM_VAULT_ABI,
      functionName: "getTriggerableVaultsBatch",
      args: [startIndex, BigInt(batchSize)],
    });

    triggerable.push(...batch);
  }

  return triggerable;
}

import {
  encodeFunctionData,
  type Address,
  type Hash,
  type WalletClient,
} from "viem";

import {
  AETERNUM_VAULT_ABI,
  getVaultAddress,
  MULTICALL3_ABI,
} from "@aeternum/blockchain";
import { CHAIN_IDS, MULTICALL3_ADDRESS } from "@aeternum/config";
import { sepolia } from "viem/chains";

import { logger } from "./logger";

export async function executeRecoveries(
  walletClient: WalletClient,
  wallets: Address[],
): Promise<Hash | null> {
  if (wallets.length === 0) {
    return null;
  }

  const vaultAddress = getVaultAddress(CHAIN_IDS.sepolia);
  const calls = wallets.map((wallet) => ({
    target: vaultAddress,
    allowFailure: true,
    callData: encodeFunctionData({
      abi: AETERNUM_VAULT_ABI,
      functionName: "triggerRecovery",
      args: [wallet],
    }),
  }));

  const hash = await walletClient.writeContract({
    account: walletClient.account!,
    chain: sepolia,
    address: MULTICALL3_ADDRESS,
    abi: MULTICALL3_ABI,
    functionName: "aggregate3",
    args: [calls],
  });

  logger.info("Submitted recovery batch", {
    walletCount: wallets.length,
    transactionHash: hash,
  });

  return hash;
}

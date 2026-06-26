import {
  createPublicClient,
  createWalletClient,
  http,
  type Account,
  type Chain,
  type PublicClient,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export function createPublicClientForRpc(
  rpcUrl: string,
  chain: Chain = sepolia,
): PublicClient {
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}

export function createWalletClientForRpc(
  rpcUrl: string,
  privateKey: `0x${string}`,
  chain: Chain = sepolia,
): WalletClient {
  const account: Account = privateKeyToAccount(privateKey);

  return createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });
}

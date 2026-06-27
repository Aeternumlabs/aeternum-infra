export {
  AETERNUM_VAULT_ABI,
  MULTICALL3_ABI,
  MULTICALL3_ADDRESS,
} from "./abi.js";
export type { AeternumVaultAbi, Multicall3Abi } from "./abi.js";

export {
  AETERNUM_VAULT_ADDRESSES,
  getVaultAddress,
} from "./addresses.js";

export {
  createViemPublicClient,
  createViemWalletClient,
} from "./client.js";
export type { ViemPublicClient, ViemWalletClient } from "./client.js";
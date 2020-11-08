// See section "Handling Numbers" for how BigNumber plays a role
import { getBlockTime } from "@colony/colony-js";
import { utils } from "ethers";
import { provider } from "../config";

export function fromBigNumber(value: utils.BigNumberish) {
  return value && new utils.BigNumber(value);
}

export const shortenHash = (hash: string) =>
  hash ? hash.substring(0, 10) : null;

export const getHashDate = async (hash: string) =>
  hash ? await getBlockTime(provider, hash) : null;

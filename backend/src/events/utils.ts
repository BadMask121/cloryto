// See section "Handling Numbers" for how BigNumber plays a role
import { utils } from "ethers";

export function fromBigNumber(value: utils.BigNumberish) {
  return value && new utils.BigNumber(value);
}

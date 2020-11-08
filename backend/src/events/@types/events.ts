export type CLPayoutClaimed = {
  token: string;
  blockHash: string;
  blockNumber: number;
  userAddress: string;
  fundingPotId: string;
  amount?: number;
};

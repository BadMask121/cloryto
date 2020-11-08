export type CLEventTypes =
  | "payments"
  | "roleSet"
  | "initialised"
  | "domainAdded";
export type CLEventLog = {
  type: CLEventTypes;
  id: string;
  blockHash: string;
  transactionHash: string;
  timestamp: number;
};

export interface CLPayoutClaimed extends CLEventLog {
  type: "payments";
  token: string;
  blockNumber: number;
  userAddress: string;
  fundingPotId: string;
  amount?: number;
}

export type CLEventGroup = CLPayoutClaimed;

export interface CLEventsInfo extends CLEventGroup {}

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
export interface CLInitialied extends CLEventLog {
  type: "initialised";
  userAddress: string;
  token: string;
  message?: string;
}
export interface CLRoleSet extends CLEventLog {
  type: "roleSet";
  role: string | number;
  userAddress: string;
  domainId: string;
}
export interface CLDomainId extends CLEventLog {
  type: "domainAdded";
  userAddress: string;
  domainId: string;
}

export type CLEventGroup =
  | CLPayoutClaimed
  | CLInitialied
  | CLRoleSet
  | CLDomainId;

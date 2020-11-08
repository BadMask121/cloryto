import { getLogs } from "@colony/colony-js";

import { getColonyClient } from "../../../config";
import { CLPayoutClaimed } from "../../@types/events";
import { fromBigNumber, getHashDate, shortenHash } from "../../utils";
import { getUserAddressFromPayment } from "../query";
import { getEventLogById } from "../query/events";
import { addEventLog } from "./event";

export const populatePayoutClaimedEvent = async () => {
  try {
    const colonyClient = await getColonyClient();
    // Get the filter
    //@ts-ignore
    const eventFilter = colonyClient.filters.PayoutClaimed();

    // GET EVENT LOGS OF PAYMENT CLAIMED
    const eventLogs = await getLogs(colonyClient, eventFilter);

    for (let i = 0; i < eventLogs.length; i++) {
      const event = eventLogs[i];

      // hash to be used as payment id
      const shortHash = shortenHash(event.transactionHash.toString());

      //parse each payment event to get the right data
      const parsed = colonyClient.interface.parseLog(event);

      const readableFundingPotId = fromBigNumber(
        parsed.values?.fundingPotId
      ).toString();

      const readableAmount = fromBigNumber(
        parsed.values?.fundingPotId
      ).toNumber();

      const timestamp = await getHashDate(event.blockHash);

      const payoutClaimed: CLPayoutClaimed = {
        type: "payments",
        id: shortHash,
        token: parsed.values?.token,
        userAddress: event.address,
        fundingPotId: readableFundingPotId,
        amount: readableAmount,
        transactionHash: event.transactionHash,
        blockHash: event.blockHash,
        blockNumber: event.blockNumber,
        timestamp,
      };

      if (readableFundingPotId && shortHash) {
        // check if log id / transaction hash exist already on db
        const alreadyExistingLog = await getEventLogById(shortHash, "payments");

        // TODO send push notification to frontend using pusher if event logged
        if (alreadyExistingLog.length <= 0) {
          const address = await getUserAddressFromPayment(
            readableFundingPotId,
            colonyClient
          );
          payoutClaimed.userAddress = address;

          await addEventLog(shortHash, payoutClaimed); // add event to log
        }
      }
    }

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

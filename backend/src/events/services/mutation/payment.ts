import { getLogs } from "@colony/colony-js";
import { COLLECTIONS } from "../../const";

import { db, getColonyClient } from "../../../config";
import { CLPayoutClaimed } from "../../@types/events";
import { fromBigNumber } from "../../utils";
import { getUserAddressFromPayment } from "../query";
import { getPaymentClaimedById } from "../query/payment";

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
      //parse each payment event to get the right data
      const parsed = colonyClient.interface.parseLog(event);

      const readableFundingPotId = fromBigNumber(
        parsed.values?.fundingPotId
      ).toString();

      const readableAmount = fromBigNumber(
        parsed.values?.fundingPotId
      ).toNumber();

      const payoutClaimed: CLPayoutClaimed = {
        userAddress: event.address,
        token: parsed.values?.token,
        fundingPotId: readableFundingPotId,
        amount: readableAmount,
        blockHash: event.blockHash,
        blockNumber: event.blockNumber,
      };

      if (readableFundingPotId) {
        const alreadyExistingPayment = await getPaymentClaimedById(
          readableFundingPotId
        );

        if (!alreadyExistingPayment) {
          const address = await getUserAddressFromPayment(
            readableFundingPotId,
            colonyClient
          );
          payoutClaimed.userAddress = address;

          await db
            .collection(COLLECTIONS.PAYMENTS_CLAIMED)
            .doc(readableFundingPotId)
            .set(payoutClaimed);
        }
      }
    }

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};

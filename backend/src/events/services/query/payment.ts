import { CLPayoutClaimed } from "../../@types/events";

import { db } from "../../../config";
import { COLLECTIONS } from "../../const";

/**
 *
 * @param id
 * get paymentclaimed by funding pot id this is from firestore
 */
export const getPaymentClaimedById = async (
  id: string
): Promise<CLPayoutClaimed> => {
  const payment = await db
    .collection(COLLECTIONS.PAYMENTS_CLAIMED)
    .doc(id)
    .get();

  if (!payment.exists) {
    return Promise.reject("No Payment found for this funding pot id");
  }

  return (payment.data() || null) as CLPayoutClaimed;
};

import { populatePayoutClaimedEvent } from "../../../src/events/services/mutation/payment";
/**
 * populates all colony events to firestore
 */
export default async () => {
  try {
    await populatePayoutClaimedEvent();
  } catch (error) {
    console.log(error);
  }
};

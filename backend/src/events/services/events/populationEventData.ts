import { populatePayoutClaimedEvent } from "../mutation/payment";

/**
 * populates all colony events to firestore
 */
export default async () => {
  try {
    console.log("populating");
    await populatePayoutClaimedEvent();
  } catch (error) {
    console.log(error);
  }
};

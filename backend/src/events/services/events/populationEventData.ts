import moment from "moment";

import { populatePayoutClaimedEvent } from "../mutation/payment";

/**
 * populates all colony events to firestore
 */
export default async (date?: Date) => {
  try {
    console.log(
      "populating event on ",
      moment(date)?.format("DDDD MMMM YYYY hh:mm a")
    );
    await populatePayoutClaimedEvent();
  } catch (error) {
    console.log(error);
  }
};

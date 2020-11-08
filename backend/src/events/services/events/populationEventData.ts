import moment from "moment";

import { populateInitialiedEvent } from "../mutation/colonyInitialied";
import { populateDomainAddedEvent } from "../mutation/domainAdded";
import { populatePayoutClaimedEvent } from "../mutation/payment";
import { populateRoleSetEvent } from "../mutation/roleSet";

/**
 * populates all colony events to firestore
 */
export default async (date?: Date) => {
  try {
    console.log(
      "populating event on ",
      moment(date)?.format("DD MMMM YYYY hh:mm a")
    );
    populatePayoutClaimedEvent();
    populateInitialiedEvent();
    populateRoleSetEvent();
    populateDomainAddedEvent();
  } catch (error) {
    console.log(error);
  }
};

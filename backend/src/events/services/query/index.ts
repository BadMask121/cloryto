import { ColonyClient } from "@colony/colony-js";

import { getColonyClient } from "../../../config";
import { getAllEventLogs } from "./events";

export const getAllEvents = async () => {
  try {
    const events = await getAllEventLogs();

    return Promise.resolve(events);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

/**
 *
 * @param humanReadableFundingPotId
 * get user Address from paymentClaimed using the string value of fundingPotId
 */
export async function getUserAddressFromPayment(
  humanReadableFundingPotId: string,
  colonyClient?: ColonyClient
) {
  try {
    colonyClient = colonyClient ? colonyClient : await getColonyClient();

    const { associatedTypeId } = await colonyClient.getFundingPot(
      humanReadableFundingPotId
    );
    const { recipient: userAddress } = await colonyClient.getPayment(
      associatedTypeId
    );
    return Promise.resolve(userAddress);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

import { getLogs } from "@colony/colony-js";

import { getColonyClient } from "../../../config";
import { CLDomainId } from "../../../../../@types/events";
import { fromBigNumber, getHashDate, shortenHash } from "../../utils";
import { getEventLogById } from "../query/events";
import { addEventLog } from "./event";

export const populateDomainAddedEvent = async () => {
  try {
    const colonyClient = await getColonyClient();
    // Get the filter
    //@ts-ignore
    const eventFilter = colonyClient.filters.ColonyRoleSet();

    // GET EVENT LOGS DOMAIN ADDED
    const eventLogs = await getLogs(colonyClient, eventFilter);

    for (let i = 0; i < eventLogs.length; i++) {
      const event = eventLogs[i];

      // hash to be used  id
      const shortHash = shortenHash(event.transactionHash.toString());

      //parse each event to get the right data
      const parsed = colonyClient.interface.parseLog(event);

      const timestamp = await getHashDate(event.blockHash);

      const readableDomainId = fromBigNumber(
        parsed?.values?.domainId
      )?.toString();

      const domainToBeAdded: CLDomainId = {
        type: "domainAdded",
        id: shortHash,
        userAddress: parsed?.values?.user,
        transactionHash: event.transactionHash,
        blockHash: event.blockHash,
        domainId: readableDomainId,
        timestamp,
      };

      if (shortHash) {
        // check if log id / transaction hash exist already on db
        const alreadyExistingLog = await getEventLogById(
          shortHash,
          "domainAdded"
        );

        // TODO send push notification to frontend using pusher if event logged
        if (alreadyExistingLog.length <= 0) {
          await addEventLog(shortHash, domainToBeAdded); // add event to log
        }
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

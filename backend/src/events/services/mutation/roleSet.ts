import { ColonyRole, getLogs } from "@colony/colony-js";

import { CLRoleSet } from "../../../../../@types/events";
import { getColonyClient } from "../../../config";
import { fromBigNumber, getHashDate, shortenHash } from "../../utils";
import { getEventLogById } from "../query/events";
import { addEventLog } from "./event";

export const populateRoleSetEvent = async () => {
  try {
    const colonyClient = await getColonyClient();
    // Get the filter
    //@ts-ignore
    const eventFilter = colonyClient.filters.ColonyRoleSet();

    // GET EVENT LOGS OF ROLE SET
    const eventLogs = await getLogs(colonyClient, eventFilter);

    for (let i = 0; i < eventLogs.length; i++) {
      const event = eventLogs[i];

      // hash to be used id
      const shortHash = shortenHash(event.transactionHash.toString());

      //parse each event to get the right data
      const parsed = colonyClient.interface.parseLog(event);

      const timestamp = await getHashDate(event.blockHash);

      const readableDomainId = fromBigNumber(
        parsed?.values?.domainId
      )?.toString();

      const roleSets: CLRoleSet = {
        type: "roleSet",
        id: shortHash,
        userAddress: parsed?.values?.user,
        transactionHash: event.transactionHash,
        blockHash: event.blockHash,
        role: ColonyRole[parsed?.values?.role],
        domainId: readableDomainId,
        timestamp,
      };

      if (shortHash) {
        // check if log id / transaction hash exist already on db
        const alreadyExistingLog = await getEventLogById(shortHash);

        // TODO send push notification to frontend using pusher if event logged
        if (!alreadyExistingLog) {
          await addEventLog(shortHash, roleSets); // add event to log
        }
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

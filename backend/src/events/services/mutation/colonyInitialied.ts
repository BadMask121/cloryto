import { getLogs } from "@colony/colony-js";

import { getColonyClient } from "../../../config";
import { CLInitialied } from "../../@types/events";
import { getHashDate, shortenHash } from "../../utils";
import { getEventLogById } from "../query/events";
import { addEventLog } from "./event";

export const populateInitialiedEvent = async () => {
  try {
    const colonyClient = await getColonyClient();
    // Get the filter
    //@ts-ignore
    const eventFilter = colonyClient.filters.ColonyInitialised();

    // GET EVENT LOGS OF INITIALIED
    const eventLogs = await getLogs(colonyClient, eventFilter);

    for (let i = 0; i < eventLogs.length; i++) {
      const event = eventLogs[i];

      // hash to be used as id
      const shortHash = shortenHash(event.transactionHash.toString());

      //parse each event to get the right data
      const parsed = colonyClient.interface.parseLog(event);

      const timestamp = await getHashDate(event.blockHash);

      const initialised: CLInitialied = {
        type: "initialised",
        id: shortHash,
        userAddress: event.address,
        transactionHash: event.transactionHash,
        blockHash: event.blockHash,
        token: parsed.values?.token,
        message: "Congratulations! It's a beautiful baby colony!",
        timestamp,
      };

      if (shortHash) {
        // check if log id / transaction hash exist already on db
        const alreadyExistingLog = await getEventLogById(
          shortHash,
          "initialised"
        );

        // TODO send push notification to frontend using pusher if event logged
        if (alreadyExistingLog.length <= 0) {
          await addEventLog(shortHash, initialised); // add event to log
        }
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

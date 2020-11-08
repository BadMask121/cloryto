import { CLEventGroup } from "../../../../../@types/events";
import { db } from "../../../config";
import { COLLECTIONS } from "../../const";

export const addEventLog = async (shortHash: string, data: CLEventGroup) => {
  if (!shortHash) {
    return Promise.reject("No hash found");
  }
  await db.collection(COLLECTIONS.EVENTS_LOG).doc(shortHash).set(data);
  return Promise.resolve(true);
};

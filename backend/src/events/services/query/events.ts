import { db } from "../../../config";
import { CLEventGroup, CLEventTypes } from "../../@types/events";
import { COLLECTIONS } from "../../const";

/**
 *
 * @param id
 * get eventLog by from firestore
 */

export const getEventLogById = async (
  id: string,
  type?: CLEventTypes
): Promise<CLEventGroup[]> => {
  if (!id) {
    return null;
  }
  let event = await db.collection(COLLECTIONS.EVENTS_LOG);

  if (type && id) {
    event = event
      .where("id", "==", id)
      .where("type", "==", type) as FirebaseFirestore.CollectionReference<
      FirebaseFirestore.DocumentData
    >;
  } else {
    event = event.where(
      "id",
      "==",
      id
    ) as FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  }

  const eventDoc = await event.get();

  if (eventDoc.size <= 0) return [];

  const foundEventDoc: CLEventGroup[] = [];
  eventDoc.forEach((o) => foundEventDoc.push(o.data() as CLEventGroup));

  return foundEventDoc;
};

/**
 * get All event logs
 */
export const getAllEventLogs = async (): Promise<CLEventGroup[]> => {
  const events = await db.collection(COLLECTIONS.EVENTS_LOG).get();

  if (events.size <= 0) {
    return Promise.reject("No event logs found");
  }
  const eventDocs: CLEventGroup[] = [];
  events.forEach((o) => eventDocs.push(o.data() as CLEventGroup));
  return eventDocs;
};

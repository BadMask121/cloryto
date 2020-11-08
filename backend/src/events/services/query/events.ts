import { CLEventGroup, CLEventTypes } from "../../../../../@types/events";
import { db } from "../../../config";
import { COLLECTIONS } from "../../const";

/**
 *
 * @param id
 * get eventLog by from firestore
 */

export const getEventLogById = async (
  id: string,
  _type?: CLEventTypes
): Promise<CLEventGroup> => {
  if (!id) {
    return null;
  }
  let event = await db.collection(COLLECTIONS.EVENTS_LOG);

  // if (type && id) {
  //   event = event
  //     .where("id", "==", id)
  //     .where("type", "==", type) as FirebaseFirestore.CollectionReference<
  //     FirebaseFirestore.DocumentData
  //   >;
  // } else {
  //   event = event.where(
  //     "id",
  //     "==",
  //     id
  //   ) as FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  // }

  const eventDoc = await event.doc(id).get();

  if (!eventDoc.exists) return null;

  // const foundEventDoc: CLEventGroup[] = [];
  // eventDoc.forEach((o) => foundEventDoc.push(o.data() as CLEventGroup));

  return eventDoc.data() as CLEventGroup;
};

/**
 * get All event logs from database
 */
export const getAllEventLogs = async (param?: {
  lastTime?: string;
  limit?: number;
  event?: CLEventTypes;
}): Promise<CLEventGroup[]> => {
  let eventsQuery = db
    .collection(COLLECTIONS.EVENTS_LOG)
    .limit(param?.limit ? param?.limit : 50);

  if (typeof param?.lastTime !== "undefined") {
    eventsQuery = eventsQuery
      .orderBy("timestamp", "desc")
      .startAfter(
        parseInt(param?.lastTime)
      ) as FirebaseFirestore.CollectionReference<
      FirebaseFirestore.DocumentData
    >;
  }
  if (typeof param?.event !== "undefined") {
    eventsQuery = eventsQuery.where("type", "==", param?.event);
  }

  const events = await eventsQuery.get();

  if (events.size <= 0) {
    return [];
  }
  const eventDocs: CLEventGroup[] = [];
  events.forEach((o) => eventDocs.push(o.data() as CLEventGroup));
  return eventDocs.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
};

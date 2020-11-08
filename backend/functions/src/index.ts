import { func } from "../../src/config";
import events from "./events";

export const populateColonyEventData = func.pubsub
  .schedule("every 10 minutes")
  .onRun(events);

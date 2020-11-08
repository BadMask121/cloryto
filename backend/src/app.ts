"use strict";
import "./config";

import timeout from "connect-timeout";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import logger from "morgan";
import schedule from "node-schedule";

import { corsOption } from "./config-cors";
import eventsRoutes from "./events/routes";
import populationEventData from "./events/services/events/populationEventData";

const app = express();
app.use(cors(corsOption));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(timeout("60s"));

//[ROUTES]
app.use("/events", eventsRoutes);

// Start the server
const PORT = process.env.PORT || 8080;

//@ts-ignore
app.use((req: Request, res: Response) => {
  res.status(403).send("Route not found").end();
});

//CRON TAB runs every 10 minutes to populate the event tables
schedule.scheduleJob("* * * * *", populationEventData);

app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT} for ${process.env.NODE_ENV} environment`
  );
  console.log("Press Ctrl+C to quit.");
});
// [END gae_flex_quickstart]
export default app;

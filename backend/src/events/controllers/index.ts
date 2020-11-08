import { Request, Response } from "express";

import { CLEventTypes } from "../../../../@types/events";
import { catchError, succesRes } from "../../errors";
import { getAllEventLogs } from "../services/query/events";

export const getEventData = async (_req: Request, res: Response) => {
  try {
    const lastTime = _req.query.lastTime as string;
    const limit = (_req.query.limit as unknown) as number;
    const event = (_req.query.event as unknown) as CLEventTypes;

    const eventsResult = await getAllEventLogs({
      event,
      lastTime,
      limit,
    });
    succesRes("success", res, eventsResult);
    return;
  } catch (error) {
    console.error(error);
    catchError(error.message, res);
    return;
  }
};

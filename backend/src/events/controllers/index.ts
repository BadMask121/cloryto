import { getAllEventLogs } from "../services/query/events";
import { Request, Response } from "express";

import { catchError, succesRes } from "../../errors";

export const getEventData = async (_req: Request, res: Response) => {
  try {
    const lastTime = _req.query.lastTime as string;
    const limit = (_req.query.limit as unknown) as number;

    const eventsResult = await getAllEventLogs(lastTime, limit);
    succesRes("success", res, eventsResult);
    return;
  } catch (error) {
    console.error(error);
    catchError(error.message, res);
    return;
  }
};

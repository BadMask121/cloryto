import { catchError, succesRes } from "../../errors";
import { Request, Response } from "express";

import { getAllEvents } from "../services/query";

export const getEventData = async (_req: Request, res: Response) => {
  try {
    const eventsResult = getAllEvents();
    succesRes("success", res, eventsResult);
    return;
  } catch (error) {
    console.error(error);
    catchError(error.message, res);
    return;
  }
};

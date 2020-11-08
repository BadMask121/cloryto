import { Response } from "express";

export default function (error: any) {
  return {
    status: "error",
    code: 500,
    error: error,
    message: "Server related errors",
    data: null as unknown,
  };
}

export const catchError = (err: any, res: Response, code?: number) => {
  let error = err;

  if (error !== null && typeof error === "object" && !Array.isArray(error)) {
    let errorEngine = [];
    // ship engine error reformation
    for (const [key, value] of Object.entries(error)) {
      if (key === "errors") {
        for (const errorElement of value as [
          { message: string; field_name: string }
        ]) {
          errorEngine.push({
            param: errorElement?.field_name ?? null,
            msg: errorElement?.message ?? null,
          });
        }
      }
    }
    error = errorEngine;
  }
  if (typeof err === "string" && err.startsWith("Value for argument"))
    error = "Invalid arguments.";
  if (
    typeof err === "string" &&
    err.startsWith("Cannot use 'in' operator to search for")
  ) {
    error = err.substring(49);
  }

  res.status(400).json({
    status: "fail",
    code: code ?? 400,
    error: error ? true : false,
    message: error,
    data: null,
  });
  return 0;
};

export const succesRes = (
  message: string,
  res: Response,
  data?: object,
  meta?: any
): Response => {
  return res.status(200).json({
    code: 200,
    status: "success",
    message,
    data: data ?? {},
    meta,
  });
};

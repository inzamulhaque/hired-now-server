import type { Response } from "express";

type TMeta = {
  limit?: number;
  page?: number;
  total?: number;
  totalPages?: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  data?: T;
  meta?: TMeta;
  message?: string;
};

const sendResponse = <T>(res: Response, payload: TResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    data: payload.data,
    meta: payload.meta,
    message: payload.message,
  });
};

export default sendResponse;

import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../shared/constents/httpStatus";
import { ApiError } from "../../shared/helpers/apiError.helper";
import { Messages } from "../../shared/constents/message";

export class ErrorHandler {
  public handle: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction 
  ): void => {
    if (err instanceof ApiError) {
      res.status(err.status).json({ message: err.message });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  };
}

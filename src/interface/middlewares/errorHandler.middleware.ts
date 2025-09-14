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
      res.status(err.status).json({status:false, message: err.message,meta:err.meta });
    } else {   
      console.log(err)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status:false, message: Messages.SERVER_ERROR });
    }
  };
}

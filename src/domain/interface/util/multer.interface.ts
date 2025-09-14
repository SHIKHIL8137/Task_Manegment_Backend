import { NextFunction, Response } from "express";
import { FileUploadRequest } from "../../../shared/utils/multer.utie";

export interface IMulter{
   secureSingleUpload (
      req: FileUploadRequest,
      res: Response,
      next: NextFunction
    ): void 
}
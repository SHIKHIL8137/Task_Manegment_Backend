import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/jwtAuth.interface";

export interface IAdminController{
  create (req: Request, res: Response, next: NextFunction): void;
  update (req: Request, res: Response, next: NextFunction): void;
  delete (req: Request, res: Response, next: NextFunction): void;
  updateStatus (req: Request, res: Response, next: NextFunction): void;
   findAllTask  (req: AuthenticatedRequest, res: Response, next: NextFunction) :void
}


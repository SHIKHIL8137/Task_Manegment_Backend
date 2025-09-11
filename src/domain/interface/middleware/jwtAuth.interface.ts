import { NextFunction, Request, RequestHandler, Response } from "express";
import { JwtPayload } from "../util/jwt.interface";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload; 
}

export interface IAuthentication {
  accessTokenhandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
  refreshTokenhandler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}

export interface IAuthorization{
  userAuth : (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
  adminAuth  : (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}
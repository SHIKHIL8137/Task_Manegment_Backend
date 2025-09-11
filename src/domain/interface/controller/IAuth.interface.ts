import { NextFunction, Request, Response } from "express";

export interface IAuthController{
  sendOtp (req: Request, res: Response, next: NextFunction): void;
  verifyOtp (req: Request, res: Response, next: NextFunction): void;
  login (req: Request, res: Response, next: NextFunction): void;
  refreshToken (req: Request, res: Response, next: NextFunction): void;
  logout (req: Request, res: Response, next: NextFunction): void;
}
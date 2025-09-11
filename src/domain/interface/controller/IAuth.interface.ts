import { NextFunction, Request, Response } from "express";

export interface IAuthController{
  test (req: Request, res: Response, next: NextFunction): void;
}
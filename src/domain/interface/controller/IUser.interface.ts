import { NextFunction, Request, Response } from "express";

export interface IUserController{
  test (req: Request, res: Response, next: NextFunction): void;
}
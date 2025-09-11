import { NextFunction, Request, Response } from "express";

export interface IUserController{
  create (req: Request, res: Response, next: NextFunction): void;
  checkName (req: Request, res: Response, next: NextFunction): void;
}
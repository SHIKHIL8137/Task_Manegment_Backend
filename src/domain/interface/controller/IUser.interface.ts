import { NextFunction, Request, Response } from "express";

export interface IUserController{
  create (req: Request, res: Response, next: NextFunction): void;
  checkName (req: Request, res: Response, next: NextFunction): void;
  delete (req: Request, res: Response, next: NextFunction): void;
  findAll (req: Request, res: Response, next: NextFunction): void;
  submitTask (req: Request, res: Response, next: NextFunction): void;
  uploadAttachment (req: Request, res: Response, next: NextFunction): void;
  getSubmissionByTaskId (
    req: Request,
    res: Response,
    next: NextFunction
  ):void;
  updateSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ):void;
}
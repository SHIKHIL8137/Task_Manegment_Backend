import { NextFunction, Request, Response } from "express";
import { IAdminController } from "../../domain/interface/controller/IAdmin.interface";

export class AdminController implements IAdminController{
  constructor(private _statusCode:Record<string,number>){}
  test = (req:Request,res:Response,next:NextFunction)=>{
    try {
      res.status(this._statusCode.OK).json({hello:'hi'})
    } catch (error) {
      next(error)
    }
  }
}
import { NextFunction, Request, Response } from "express"
import { IAuthController } from "../../domain/interface/controller/IAuth.interface"

export class AuthController implements IAuthController{
  constructor(private _statusCode:Record<string,number>){}
  test = (req:Request,res:Response,next:NextFunction)=>{
    try {
      res.status(this._statusCode.OK).json({hello:'hi'})
    } catch (error) {
      next(error)
    }
  }
}
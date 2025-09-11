import { NextFunction, Request, Response } from "express"
import { IUserController } from "../../domain/interface/controller/IUser.interface"

export class UserController implements IUserController{
    constructor(private _statusCode:Record<string,number>){}
    test = (req:Request,res:Response,next:NextFunction)=>{
      try {
        res.status(this._statusCode.OK).json({hello:'hi'})
      } catch (error) {
        next(error)
      }
    }
}
import { Types } from "mongoose";
import { ITask, IUser } from "../../../../domain/interface/types/schem.interface";

export class CreateUsecaseRepsonseDto{
  constructor(
    public id:string,
    public userId:string,
    public name:string,
    public email:string,
    public role:string,
  ){}
}

export class LoginValidationResponseDto{
  constructor(
    public id:string,
    public userId:string,
    public name:string,
    public email:string,
    public role:string,
    public accessToken:string,
    public refreshToken:string
  ){}
}

export class RefreshTokenResponseDto{
  constructor(
    public accessToken:string
  ){}
}

export class UserReponseDto{
  constructor(
    public id:string,
    public userId:string,
    public name:string,
    public email:string,
    public role:string,
    public createdAt:Date,
    public updatedAt:Date,
    public isDeleted:boolean
  ){}
}


export class SubmissionResponseDto{
  constructor(
    public id:string,
    public submissionId:string,
    public taskId:Partial<ITask>,
    public description : string,
    public documents:string,
    public userId:Partial<IUser>,
    public createdAt:Date,
    public updatedAt:Date,
    public isVerified :boolean
  ){}
}
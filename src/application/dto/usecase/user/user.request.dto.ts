import { Types } from "mongoose";

export class CreateUsecaseRequestDto{
  constructor(
    public name:string,
    public email:string,
    public password:string,
    public role:string,
    public userId : string
  ){}
}

export class SubmissionRequestDto{
  constructor(
    public submissionId:string,
    public taskId:Types.ObjectId,
    public description : string,
    public documents:string,
    public userId:Types.ObjectId
  ){}
}
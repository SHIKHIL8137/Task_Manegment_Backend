import { Types } from "mongoose";

export class CreateTaskRequestDto{
  public assignedUserId: Types.ObjectId;
  constructor(
    public title:string,
    public description:string,
    public dueDate:Date,
    public priority:string,
    assignedUserId: string 
  ){
    this.assignedUserId = new Types.ObjectId(assignedUserId);
  }
}

export class DeleteTaskRequestDto{
  constructor(
    public isDeleted : boolean
  ){}
}

export class UpdateStatusRequestDto{
  constructor(
    public status:string
  ){}
}
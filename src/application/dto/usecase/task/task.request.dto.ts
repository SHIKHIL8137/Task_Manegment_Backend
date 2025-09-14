import { Types } from "mongoose";

export class TaskCreateRequestUscaseDto{
  constructor(
    public taskId:string,
    public title:string,
    public description:string,
    public dueDate:Date,
    public priority:string,
    public assignedUserId: Types.ObjectId 
  ){}
}
import { Types } from "mongoose";
import {  IUser } from "../interface/types/schem.interface";

export class Task{
  public id: string;
  constructor(
    id: Types.ObjectId | string,
    public taskId : string,
    public title : string,
    public description :string,
    public dueData : Date,
    public priority : string,
    public status : string,
    public createdAt:Date,
    public updatedAt:Date,
    public isDeleted:boolean,
    public assignedUserId:Partial<IUser>
  ){
    this.id = typeof id === "string" ? id : id.toString();
  }
}


import { Types } from "mongoose";

export class User{
  public id: string;
  constructor(
    id: Types.ObjectId | string,
    public userId:string,
    public email:string,
    public name:string,
    public role:string,
    public isDeleted:boolean,
    public password:string,
    public createdAt:Date,
    public updatedAt:Date,
  ){
   this.id = typeof id === "string" ? id : id.toString()
  }
}
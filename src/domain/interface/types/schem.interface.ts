import { Types } from "mongoose"

export interface IOtp{
  otp:number
  email:string
  createdAt :Date
  expiredAt :Date
}

export interface ISubmission{
  submissionId :string
  taskId : Types.ObjectId
  description:string
  documents:string
  createdAt :Date
  updatedAt :Date
  isDeleted : boolean
  userId : Types.ObjectId,
  isVerified:boolean
}

export interface ITask{
  taskId : string
  title :string
  description :string
  priority : string
  dueDate : Date
  status : string
  createdAt :Date
  updatedAt :Date
  isDeleted : boolean
  assignedUserId :Types.ObjectId
}


export interface IUser{
  userId:string
  name:string
  email :string
  password :string
  role :string
  createdAt :Date
  updatedAt :Date
  isDeleted : boolean
}

export interface FindAllOptions {
  filter?: Partial<IUser>;
  skip?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FindAllOption {
  filter?: Partial<Record<keyof ITask, string | boolean | Date>>;
  search?: string;
  skip?: number;
  limit?: number;
  sortBy?: keyof ITask;
  sortOrder?: "asc" | "desc";
}
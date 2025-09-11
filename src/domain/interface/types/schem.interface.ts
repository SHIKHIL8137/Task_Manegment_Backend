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
  documents:string[]
  createdAt :Date
  updatedAt :Date
  isDeleted : boolean
  userId : Types.ObjectId
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
import mongoose, { Schema, Types } from "mongoose";
import { ITask } from "../../../domain/interface/types/schem.interface";

interface ITaskDocument extends ITask,Document {};

const taskSchema = new Schema<ITaskDocument>({
  taskId:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  dueDate:{
    type:Date,
    required:true
  },
  createdAt:{
    type:Date,
    default: Date.now,
  },
  updatedAt:{
    type:Date,
    default: Date.now,
  },
  isDeleted:{
    type:Boolean,
    required :true,
    default : false
  },
  assignedUserId:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"], 
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed","expired"], 
    default: "pending",
    required: true,
  },
})

const TaskModel = mongoose.models.Submission || mongoose.model<ITaskDocument>("Task",taskSchema);
export default TaskModel;
export type {ITaskDocument}
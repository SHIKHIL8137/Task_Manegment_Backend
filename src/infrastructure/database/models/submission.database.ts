import mongoose, { Schema, Types } from "mongoose";
import { ISubmission } from "../../../domain/interface/types/schem.interface";

interface ISubmissionDocument extends ISubmission,Document {};

const submissionSchema = new Schema<ISubmissionDocument>({
  submissionId:{
    type:String,
    required:true
  },
  taskId:{
    type:Schema.Types.ObjectId,
    ref:'Task',
    required:true
  },
  description:{
    type:String,
    required:true
  },
  documents:{
    type:[String]
  },
  createdAt:{
    type:Date,
    required:true,
    default: Date.now,
  },
  updatedAt:{
    type:Date,
    required:true,
    default: Date.now,
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  isDeleted:{
    type:Boolean,
    required :true,
    default : false
  }
})

const SubmissionModel = mongoose.models.Submission || mongoose.model<ISubmissionDocument>("Submission",submissionSchema);
export default SubmissionModel;
export type {ISubmissionDocument}
import { Model } from "mongoose";
import { ISubmissionDocument } from "../models/submission.database";
import { ISubmissionRepository } from "../../../domain/interface/repository/submission.interface";
import {
  ISubmission,
  ITask,
  IUser,
} from "../../../domain/interface/types/schem.interface";
import { Submission } from "../../../domain/entities/submission..entite";
import { populate } from "dotenv";

export class SubmissionRepository implements ISubmissionRepository {
  constructor(private _model: Model<ISubmissionDocument>) {}
  create = async (data: Partial<ISubmission>): Promise<Submission | null> => {
    const doc = new this._model(data);
    const saved = await doc.save();
    const populated = await this._model
      .findById(saved._id)
      .populate("taskId")
      .populate("userId");

    if (!populated) return null;
    return new Submission(
      populated._id,
      populated.submissionId,
      populated.taskId as Partial<ITask>,
      populated.description,
      populated.documents,
      populated.createdAt,
      populated.updatedAt,
      populated.isDeleted,
      populated.userId as Partial<IUser>,
      populated.isVerified
    );
  };

  findByTaskId = async (
    data: Partial<ISubmission>
  ): Promise<Submission[] | null> => {
    const result = await this._model
      .find(data)
      .populate("taskId")
      .populate("userId");
    return result.map(
      (task) =>
        new Submission(
          task._id,
          task.submissionId,
          task.taskId as Partial<ITask>,
          task.description,
          task.documents,
          task.createdAt,
          task.updatedAt,
          task.isDeleted,
          task.userId as Partial<IUser>,
          task.isVerified
        )
    );
  };

   update = async (
     id: string,
     data: Partial<ISubmission>
   ): Promise<Submission | null> => {
     const updated = await this._model
       .findByIdAndUpdate({ id }, { $set: data }, { new: true })
       .populate("assignedUserId");
 
     if (!updated) return null;
    return new Submission(
      updated._id,
      updated.submissionId,
      updated.taskId as Partial<ITask>,
      updated.description,
      updated.documents,
      updated.createdAt,
      updated.updatedAt,
      updated.isDeleted,
      updated.userId as Partial<IUser>,
      updated.isVerified
    );
   };
}

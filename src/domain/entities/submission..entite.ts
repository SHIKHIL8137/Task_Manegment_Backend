import { Types } from "mongoose";
import { ITask, IUser } from "../interface/types/schem.interface";

export class Submission {
  public id: string;
  constructor(
    id: Types.ObjectId | string,
    public submissionId: string,
    public taskId: Partial<ITask>,
    public description: string,
    public documents: string,
    public createdAt: Date,
    public updatedAt: Date,
    public isDeleted: boolean,
    public userId: Partial<IUser>,
    public isVerified: boolean
  ) {
    this.id = typeof id === "string" ? id : id.toString();
  }
}

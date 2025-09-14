import { Model, Types } from "mongoose";
import {
  FindAllOption,
  ITask,
  IUser,
} from "../../../domain/interface/types/schem.interface";
import { Task } from "../../../domain/entities/Task.entite";
import { ITaskDocument } from "../models/task.database";
import { ITaskRepository } from "../../../domain/interface/repository/task.interface";
import { Submission } from "../../../domain/entities/submission..entite";

export class TaskRepository implements ITaskRepository {
  constructor(private _model: Model<ITaskDocument>) {}

  create = async (data: Partial<ITask>): Promise<Task | null> => {
    const doc = new this._model(data);
    const saved = await doc.save();
    const populated = await this._model
      .findById(saved._id)
      .populate("assignedUserId");

    if (!populated) return null;
    const id = populated._id as unknown as Types.ObjectId;
    return new Task(
      id,
      populated.taskId,
      populated.title,
      populated.description,
      populated.dueDate,
      populated.priority,
      populated.status,
      populated.createdAt,
      populated.updatedAt,
      populated.isDeleted,
      populated.assignedUserId as Partial<IUser>
    );
  };

  update = async (
    taskId: string,
    data: Partial<ITask>
  ): Promise<Task | null> => {
    const updated = await this._model
      .findOneAndUpdate({ taskId }, { $set: data }, { new: true })
      .populate("assignedUserId");

    if (!updated) return null;
    const id = updated._id as unknown as Types.ObjectId;
    return new Task(
      id,
      updated.taskId,
      updated.title,
      updated.description,
      updated.dueDate,
      updated.priority,
      updated.status,
      updated.createdAt,
      updated.updatedAt,
      updated.isDeleted,
      updated.assignedUserId as Partial<IUser>
    );
  };

  findExpiredTask = async (): Promise<Task[] | null> => {
    const result = await this._model.aggregate([
      { $match: { dueDate: { $lt: new Date() }, isDeleted: false } },
    ]);
    if (!result.length) return null;

    return result.map(
      (data) =>
        new Task(
          data._id as unknown as Types.ObjectId,
          data.taskId,
          data.title,
          data.description,
          data.dueDate,
          data.priority,
          data.status,
          data.createdAt,
          data.updatedAt,
          data.isDeleted,
          data.assignedUserId as Partial<IUser>
        )
    );
  };

  findAll = async (
    role: string,
    userId: string,
    options: FindAllOption = {}
  ): Promise<Task[] | null> => {
    const {
      filter = {},
      search,
      skip = 0,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "asc",
    } = options;

    const query: any = { ...filter };

    if (role === "user") {
      query.assignedUserId = new Types.ObjectId(userId);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // const tasks = await this._model
    //   .find(query)
    //   .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    //   .skip(skip)
    //   .limit(limit)
    //   .exec();

    const tasks = await this._model.aggregate([
  { $match: query },
  {
    $addFields: {
      priorityOrder: {
        $switch: {
          branches: [
            { case: { $eq: ["$priority", "High"] }, then: 1 },
            { case: { $eq: ["$priority", "Medium"] }, then: 2 },
            { case: { $eq: ["$priority", "Low"] }, then: 3 },
          ],
          default: 4,
        },
      },
    },
  },
  { $sort: { priorityOrder: 1, createdAt: -1 } }, 
  { $skip: skip },
  { $limit: limit },
]);


    if (!tasks) return null;

    return tasks.map(
      (data) =>
        new Task(
          data._id as unknown as Types.ObjectId,
          data.taskId,
          data.title,
          data.description,
          data.dueDate,
          data.priority,
          data.status,
          data.createdAt,
          data.updatedAt,
          data.isDeleted,
          data.assignedUserId as Partial<IUser>
        )
    );
  };
}

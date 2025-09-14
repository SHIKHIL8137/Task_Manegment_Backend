import { FilterQuery, Model, Types } from "mongoose";
import { IUserDocument } from "../models/user.database";
import {
  FindAllOptions,
  IUser,
} from "../../../domain/interface/types/schem.interface";
import { IUserRepository } from "../../../domain/interface/repository/user.interface";
import { User } from "../../../domain/entities/user.entite";

export class UserRepository implements IUserRepository {
  constructor(private _model: Model<IUserDocument>) {}
  create = async (data: Partial<IUser>): Promise<Partial<User> | null> => {
    const doc = new this._model(data);
    const saved = await doc.save();
    const id = saved._id as unknown as Types.ObjectId;
    return new User(
      id,
      saved.userId,
      saved.email,
      saved.name,
      saved.role,
      saved.isDeleted,
      saved.password,
      saved.createdAt,
      saved.updatedAt
    );
  };
  findByName = async (data: Partial<IUser>): Promise<Partial<User> | null> => {
    const result = await this._model.findOne({
      name: { $regex: `^${data.name}`, $options: "i" },
    });
    if (!result) return null;
    const id = result._id as unknown as Types.ObjectId;
    return new User(
      id,
      result.userId,
      result.email,
      result.name,
      result.role,
      result.isDeleted,
      result.password,
      result.createdAt,
      result.updatedAt
    );
  };
  findByEmail = async (
    data: Partial<IUser>
  ): Promise<Partial<User> | null> => {
    const result = await this._model.findOne({ email: data.email });
    if (!result) return null;
    const id = result._id as unknown as Types.ObjectId;
    return new User(
      id,
      result.userId,
      result.email,
      result.name,
      result.role,
      result.isDeleted,
      result.password,
      result.createdAt,
      result.updatedAt
    );
  };
  update = async (
    userId: string,
    data: Partial<IUser>
  ): Promise<User | null> => {
    const updated = await this._model.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true }
    );

    if (!updated) return null;

    const id = updated._id as unknown as Types.ObjectId;

    return new User(
      id,
      updated.userId,
      updated.email,
      updated.name,
      updated.role,
      updated.isDeleted,
      updated.password,
      updated.createdAt,
      updated.updatedAt
    );
  };
  findAll = async (options: FindAllOptions): Promise<User[] | null> => {
    const {
      filter = {},
      skip = 0,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "asc",
    } = options;
    const query: FilterQuery<IUser> = {};
    if (filter.name) query.name = { $regex: filter.name, $options: "i" };
    if (filter.email) query.email = { $regex: filter.email, $options: "i" };
    query.isDeleted = filter.isDeleted !== undefined ? filter.isDeleted : false;
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    const data = await this._model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    return data.map(
      (user) =>
        new User(
          user._id as unknown as Types.ObjectId,
          user.userId,
          user.email,
          user.name,
          user.role,
          user.isDeleted,
          user.password,
          user.createdAt,
          user.updatedAt
        )
    );
  };
}

import { Model } from "mongoose";
import { IUserDocument } from "../models/user.database";
import { IUser } from "../../../domain/interface/types/schem.interface";
import { IUserRepository } from "../../../domain/interface/repository/user.interface";
import { User } from "../../../domain/entities/user.entite";

export class UserRepository implements IUserRepository{
  constructor(private _model:Model<IUserDocument>){}
  create = async(data:Partial<IUser>):Promise<Partial<IUser> | null>=>{
      const doc = new this._model(data);
      const saved =  await doc.save();
      return new User(
        saved.userId,
        saved.email,
        saved.name,
        saved.role, 
        saved.isDeleted,
        saved.password
      );
    }
  findByName = async(data:Partial<IUser>):Promise<Partial<IUser>|null>=>{
    const result = await this._model.findOne({name:{$regex:`^${data.name}`,$options:'i'}})
    if(!result) return null
    return new User(
        result.userId,
        result.email,
        result.name,
        result.role, 
        result.isDeleted,
        result.password
      );
  }
  findByEmail =  async(data:Partial<IUser>):Promise<Partial<IUser>|null>=>{
     const result = await this._model.findOne({email:data.email})
    if(!result) return null
    return new User(
        result.userId,
        result.email,
        result.name,
        result.role, 
        result.isDeleted,
        result.password
      );
  }
}
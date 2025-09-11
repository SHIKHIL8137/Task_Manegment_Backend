import { IUser } from "../types/schem.interface";

export interface IUserRepository{
  create(data:Partial<IUser>):Promise<Partial<IUser> | null>
  findByName (data:Partial<IUser>):Promise<Partial<IUser>|null>;
  findByEmail(data:Partial<IUser>):Promise<Partial<IUser>|null>
}
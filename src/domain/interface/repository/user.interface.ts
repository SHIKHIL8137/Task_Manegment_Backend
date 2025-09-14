import { User } from "../../entities/user.entite";
import { FindAllOptions, IUser } from "../types/schem.interface";

export interface IUserRepository{
  create(data:Partial<IUser>):Promise<Partial<User> | null>
  findByName (data:Partial<IUser>):Promise<Partial<User>|null>;
  findByEmail(data:Partial<IUser>):Promise<Partial<User>|null>;
   update(
       userId: string,
       data: Partial<IUser>
     ): Promise<User | null>
  findAll(options: FindAllOptions):Promise<User[] | null>;
}
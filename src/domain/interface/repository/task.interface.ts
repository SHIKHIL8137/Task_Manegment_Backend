import { Task } from "../../entities/Task.entite";
import { FindAllOption, ITask } from "../types/schem.interface";

export interface ITaskRepository{
  create(data: Partial<ITask>): Promise<Task | null> ;
  update(
    taskId: string,
    data: Partial<ITask>
  ): Promise<Task | null>
  findExpiredTask ():Promise<Task[] | null>;
  findAll (
      role: string,
      userId: string,
      options: FindAllOption
    ): Promise<Task[] | null> 
}
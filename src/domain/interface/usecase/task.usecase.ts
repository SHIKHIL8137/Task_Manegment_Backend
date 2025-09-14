import { TaskCreateResponseUscaseDto } from "../../../application/dto/usecase/task/task.response.dto";
import { FindAllOption, ITask } from "../types/schem.interface";

export interface ITaskUsecase {
  create(data: Partial<ITask>): Promise<TaskCreateResponseUscaseDto | null>;
  update(
    taskId: string,
    data: Partial<ITask>
  ): Promise<TaskCreateResponseUscaseDto | null>;
   checkTaskExpired():Promise<void>;
   findAllTask (role:string,userId:string,options:FindAllOption):Promise<TaskCreateResponseUscaseDto[] | null>
}

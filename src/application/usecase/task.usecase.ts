import { Types } from "mongoose";
import { ITaskRepository } from "../../domain/interface/repository/task.interface";
import { FindAllOption, ITask } from "../../domain/interface/types/schem.interface";
import { IGenerateData } from "../../domain/interface/util/generateData.interface";
import { TaskCreateRequestUscaseDto } from "../dto/usecase/task/task.request.dto";
import { TaskCreateResponseUscaseDto } from "../dto/usecase/task/task.response.dto";
import { ApiError } from "../../shared/helpers/apiError.helper";
import { ITaskUsecase } from "../../domain/interface/usecase/task.usecase";

export class TaskUSecase implements ITaskUsecase {
  constructor(
    private _taskRepo: ITaskRepository,
    private _genarateData: IGenerateData,
    private _statusCode: Record<string, number>,
    private _message: Record<string, string>
  ) {}
  create = async (
    data: Partial<ITask>
  ): Promise<TaskCreateResponseUscaseDto | null> => {
    const newTaskId = this._genarateData.generateTaskId();
    const requestDto = new TaskCreateRequestUscaseDto(
      newTaskId,
      data.title!,
      data.description!,
      data.dueDate!,
      data.priority!,
      data.assignedUserId!
    );
    const result = await this._taskRepo.create(requestDto);
    if (!result)
      throw new ApiError(
        this._statusCode.BAD_REQUEST,
        this._message.SERVER_ERROR
      );
    const responseDto = new TaskCreateResponseUscaseDto(
      result.id,
      result.taskId,
      result.title,
      result.description,
      result.dueData,
      result.priority,
      result.status,
      result.createdAt,
      result.updatedAt,
      result.isDeleted,
      {
        userId: result.assignedUserId.userId!,
        email: result.assignedUserId.email!,
        name: result.assignedUserId.name!,
      }
    );
    return responseDto;
  };
  update = async (
    taskId: string,
    data: Partial<ITask>
  ): Promise<TaskCreateResponseUscaseDto | null> => {
    const result = await this._taskRepo.update(taskId, data);

    if (!result)
      throw new ApiError(
        this._statusCode.NOT_FOUND,
        this._message.TASK_NOT_FOUND
      );

    return new TaskCreateResponseUscaseDto(
      result.id,
      result.taskId,
      result.title,
      result.description,
      result.dueData,
      result.priority,
      result.status,
      result.createdAt,
      result.updatedAt,
      result.isDeleted,
      {
        userId: result.assignedUserId.userId!,
        email: result.assignedUserId.email!,
        name: result.assignedUserId.name!,
      }
    );
  };

  checkTaskExpired = async (): Promise<void> => {
    const tasks = await this._taskRepo.findExpiredTask();
    if (tasks && tasks.length > 0) {
      tasks.map((task) =>
        this._taskRepo.update(task.taskId, { status: "expired" })
      );
    }
  };

  findAllTask = async(role:string,userId:string,options:FindAllOption):Promise<TaskCreateResponseUscaseDto[] | null>=>{
     const result = await this._taskRepo.findAll(role,userId,options);

    if (!result)
      throw new ApiError(
        this._statusCode.NOT_FOUND,
        this._message.TASK_NOT_FOUND
      );

    return result.map((result)=>
    new TaskCreateResponseUscaseDto(
      result.id,
      result.taskId,
      result.title,
      result.description,
      result.dueData,
      result.priority,
      result.status,
      result.createdAt,
      result.updatedAt,
      result.isDeleted,
      {
        userId: result.assignedUserId.userId!,
        email: result.assignedUserId.email!,
        name: result.assignedUserId.name!,
      }
    )
    )
  }
}

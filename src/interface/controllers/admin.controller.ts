import { NextFunction, Request, Response } from "express";
import { IAdminController } from "../../domain/interface/controller/IAdmin.interface";
import {
  CreateTaskRequestDto,
  DeleteTaskRequestDto,
  UpdateStatusRequestDto,
} from "../../application/dto/controller/admin/admin.request.dto";
import { ApiError } from "../../shared/helpers/apiError.helper";
import { CreateTaskResponseDto } from "../../application/dto/controller/admin/admin.response.dto";
import { ITaskUsecase } from "../../domain/interface/usecase/task.usecase";
import { AuthenticatedRequest } from "../../domain/interface/middleware/jwtAuth.interface";
import { ITask } from "../../domain/interface/types/schem.interface";

export class AdminController implements IAdminController {
  constructor(
    private _statusCode: Record<string, number>,
    private _message: Record<string, string>,
    private _taskUsecase: ITaskUsecase
  ) {}
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, dueData, priority, assignedUserId } =
        req.body;
      if (!title || !description || !dueData || !priority || !assignedUserId)
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._message.FIELD_MISSING
        );
      const requestDto = new CreateTaskRequestDto(
        title,
        description,
        dueData,
        priority,
        assignedUserId
      );
      const result = await this._taskUsecase.create(requestDto);
      if (!result)
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._message.SERVER_ERROR
        );
      const responseDto = new CreateTaskResponseDto(
        result.id,
        result.taskId,
        result.title,
        result.description,
        result.dueDate,
        result.priority,
        result.status,
        result.createdAt,
        result.updatedAt,
        {
          userId: result.assignedUserId.userId,
          email: result.assignedUserId.email,
          name: result.assignedUserId.name,
        }
      );
      res.status(this._statusCode.CREATED).json({ status: true, responseDto });
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.params;
      const { title, description, dueDate, priority, status, assignedUserId } =
        req.body;

      if (!taskId) {
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._message.FIELD_MISSING
        );
      }

      const updateData = {
        ...(title && { title }),
        ...(description && { description }),
        ...(dueDate && { dueDate }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(assignedUserId && { assignedUserId }),
        updatedAt: new Date(),
      };

      const result = await this._taskUsecase.update(taskId, updateData);

      if (!result) {
        throw new ApiError(
          this._statusCode.NOT_FOUND,
          this._message.TASK_NOT_FOUND
        );
      }

      const responseDto = new CreateTaskResponseDto(
        result.id,
        result.taskId,
        result.title,
        result.description,
        result.dueDate,
        result.priority,
        result.status,
        result.createdAt,
        result.updatedAt,
        {
          userId: result.assignedUserId.userId,
          email: result.assignedUserId.email,
          name: result.assignedUserId.name,
        }
      );

      res.status(this._statusCode.OK).json({ status: true, responseDto });
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.params;
      const requestDto = new DeleteTaskRequestDto(true);
      const result = await this._taskUsecase.update(taskId, requestDto);

      if (!result) {
        throw new ApiError(
          this._statusCode.NOT_FOUND,
          this._message.TASK_NOT_FOUND
        );
      }
      res.status(this._statusCode.OK).json({ status: true });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) =>{
    try {
      const { taskId } = req.params;
      const {status} = req.body;
      if(!status || !taskId) throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._message.FIELD_MISSING
        );
      const requestDto = new UpdateStatusRequestDto(status);
      const result = await this._taskUsecase.update(taskId, requestDto);

      if (!result) {
        throw new ApiError(
          this._statusCode.NOT_FOUND,
          this._message.TASK_NOT_FOUND
        );
      }
      const responseDto = new CreateTaskResponseDto(
        result.id,
        result.taskId,
        result.title,
        result.description,
        result.dueDate,
        result.priority,
        result.status,
        result.createdAt,
        result.updatedAt,
        {
          userId: result.assignedUserId.userId,
          email: result.assignedUserId.email,
          name: result.assignedUserId.name,
        }
      );

      res.status(this._statusCode.OK).json({ status: true, responseDto });
    } catch (error) {
      next(error);
    }
  }

  findAllTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
    try {
      const user = req.user ;
      const { limit, skip, sortBy, sortOrder, priority, status, search } = req.query;
      const sortField = (sortBy as keyof ITask) || "createdAt";
      const sortOrderValue: "asc" | "desc" = sortOrder === "desc" ? "desc" : "asc";
      const options = {
        filter: {
          ...(priority && { priority: String(priority) }),
          ...(status && { status: String(status) }),
        },
        search: search ? String(search) : undefined,
        skip: skip ? Number(skip) : 0,
        limit: limit ? Number(limit) : 10,
        sortBy: sortField,
        sortOrder: sortOrderValue,
      };

      const tasks = await this._taskUsecase.findAllTask(user?.role!, user?.id!, options);

      const responseDto = tasks?.map((result)=>
      new CreateTaskResponseDto(
        result.id,
        result.taskId,
        result.title,
        result.description,
        result.dueDate,
        result.priority,
        result.status,
        result.createdAt,
        result.updatedAt,
        {
          userId: result.assignedUserId.userId,
          email: result.assignedUserId.email,
          name: result.assignedUserId.name,
        }
      )
      )

      res.status(this._statusCode.OK).json({
        status: true,
        data: responseDto || [],
        limit: options.limit,
        skip: options.skip,
      });
    } catch (error) {
      next(error)
    }
  }
}

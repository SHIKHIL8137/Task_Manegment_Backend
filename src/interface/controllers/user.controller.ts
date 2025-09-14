import { NextFunction, Request, Response } from "express";
import { IUserController } from "../../domain/interface/controller/IUser.interface";
import {
  CheckNameRequestDto,
  CreateUserRequestDto,
  DeleteUserRequestDto,
  getSubmissionByTaskIdDto,
  SubmissionCreateRequestDto,
} from "../../application/dto/controller/user/user.request.dto";
import { IUserUsecase } from "../../domain/interface/usecase/user.usecase";
import { ApiError } from "../../shared/helpers/apiError.helper";
import { FindAllOptions } from "../../domain/interface/types/schem.interface";
import {
  SubmissionResponseDto,
  UserResponseDto,
} from "../../application/dto/controller/user/user.response.dto";

export class UserController implements IUserController {
  constructor(
    private _statusCode: Record<string, number>,
    private _messages: Record<string, string>,
    private _userUsecase: IUserUsecase
  ) {}
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, otp, role } = req.body;
      if (!name || !email || !password || !otp || !role)
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._messages.FIELD_MISSING
        );
      const reqDto = new CreateUserRequestDto(name, email, password, Number(otp), role);
      const result = await this._userUsecase.create(reqDto);
      if (!result)
        throw new ApiError(
          this._statusCode.NOT_FOUND,
          this._messages.NOT_FOUND
        );
      res
        .status(this._statusCode.OK)
        .json({ status: true, message: this._messages.USER_CREATED });
    } catch (error) {
      next(error);
    }
  };

  checkName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query;
      if (!name)
        throw new ApiError(
          this._statusCode.NOT_FOUND,
          this._messages.FIELD_INVALID
        );
      const requestDto = new CheckNameRequestDto(name.toString());
      const result = await this._userUsecase.checkName(requestDto);
      res
        .status(this._statusCode.OK)
        .json({ status: true, exist: result ? true : false });
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const requestDto = new DeleteUserRequestDto(true);
      const result = await this._userUsecase.update(userId, requestDto);
      if (!result) {
        throw new ApiError(
          this._statusCode.NOT_FOUND,
          this._messages.TASK_NOT_FOUND
        );
      }
      res.status(this._statusCode.OK).json({ status: true });
    } catch (error) {
      next(error);
    }
  };
  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, isDeleted, limit, sortBy, skip, sortOrder } =
        req.query;
      const options: FindAllOptions = {
        filter: {
          ...(name && { name: String(name) }),
          ...(email && { email: String(email) }),
          ...(isDeleted !== undefined && { isDeleted: isDeleted === "true" }),
        },
        skip: skip ? Number(skip) : 0,
        limit: limit ? Number(limit) : 10,
        sortBy: sortBy ? String(sortBy) : "createdAt",
        sortOrder: sortOrder === "desc" ? "desc" : "asc",
      };
      const result = await this._userUsecase.findAllUsers(options);

      const responseDto = result?.map(
        (user) =>
          new UserResponseDto(
            user.id,
            user.userId,
            user.name,
            user.email,
            user.createdAt,
            user.updatedAt
          )
      );
      const finalData = {
      users: responseDto,
      limit: options.limit,
      skip: options.skip
      };
      res.status(this._statusCode.OK).json({ status: true, finalData });
    } catch (error) {
      next(error);
    }
  };
  submitTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId, description, documents, userId } = req.body;
      if (!taskId || !description || !userId)
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._messages.FIELD_MISSING
        );
      const requestDto = new SubmissionCreateRequestDto(
        taskId,
        userId,
        description,
        documents
      );
      const result = await this._userUsecase.submission(requestDto);
      if (!result)
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._messages.SERVER_ERROR
        );
      const responseDto = new SubmissionResponseDto(
        result.submissionId,
        {
          taskId: result.taskId.taskId!,
          description: result.taskId.description!,
          priority: result.taskId.priority!,
          status: result.taskId.status!,
          title: result.taskId.title!,
        },
        result.documents,
        result.description,
        result.createdAt,
        result.updatedAt,
        {
          userId: result.userId.userId!,
          name: result.userId.name!,
          email: result.userId.email!,
        },
        result.isVerified
      );
      res.status(this._statusCode.OK).json({ status: true, responseDto });
    } catch (error) {
      next(error);
    }
  };
  uploadAttachment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filePath = req.file?.filename;

      if (!filePath) {
        res
          .status(this._statusCode.BAD_REQUEST)
          .json({ status: false, message: this._messages.UPLOAD_ERROR });
        return;
      }

      res.status(this._statusCode.OK).json({
        status: true,
        file: filePath,
      });
    } catch (error) {
      next(error);
    }
  };
  updateSubmission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { description, documents } = req.body;

      if (!id) {
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._messages.FIELD_MISSING
        );
      }

      const updateData = {
        ...(description && { description }),
        ...(documents && { documents }),
        updatedAt: new Date(),
      };

      const result = await this._userUsecase.updateSubmission(id, updateData);

      if (!result) {
        throw new ApiError(
          this._statusCode.NOT_FOUND,
          this._messages.TASK_NOT_FOUND
        );
      }

      const responseDto = new SubmissionResponseDto(
        result.submissionId,
        {
          taskId: result.taskId.taskId!,
          description: result.taskId.description!,
          priority: result.taskId.priority!,
          status: result.taskId.status!,
          title: result.taskId.title!,
        },
        result.documents,
        result.description,
        result.createdAt,
        result.updatedAt,
        {
          userId: result.userId.userId!,
          name: result.userId.name!,
          email: result.userId.email!,
        },
        result.isVerified
      );

      res.status(this._statusCode.OK).json({ status: true, responseDto });
    } catch (error) {
      next(error);
    }
  };

  getSubmissionByTaskId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { taskId } = req.params;
      const requestDto = new getSubmissionByTaskIdDto(taskId);
      const result = await this._userUsecase.getSubmissions(requestDto);
      if (!result)
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._messages.SERVER_ERROR
        );

      const responseDto = result.map(
        (date) =>
          new SubmissionResponseDto(
            date.submissionId,
            {
              taskId: date.taskId.taskId!,
              description: date.taskId.description!,
              priority: date.taskId.priority!,
              status: date.taskId.status!,
              title: date.taskId.title!,
            },
            date.documents,
            date.description,
            date.createdAt,
            date.updatedAt,
            {
              userId: date.userId.userId!,
              name: date.userId.name!,
              email: date.userId.email!,
            },
            date.isVerified
          )
      );

      res.status(this._statusCode.OK).json({ status: true, responseDto });
    } catch (error) {
      next(error);
    }
  };
}

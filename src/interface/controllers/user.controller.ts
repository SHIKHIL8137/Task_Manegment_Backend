import { NextFunction, Request, Response } from "express";
import { IUserController } from "../../domain/interface/controller/IUser.interface";
import {
  CheckNameRequestDto,
  CreateUserRequestDto,
} from "../../application/dto/controller/user/user.request.dto";
import { IUserUsecase } from "../../domain/interface/usecase/user.usecase";
import { ApiError } from "../../shared/helpers/apiError.helper";

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
      const reqDto = new CreateUserRequestDto(name, email, password, otp, role);
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
}

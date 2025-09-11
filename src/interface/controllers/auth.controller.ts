import { NextFunction, Request, Response } from "express";
import { IAuthController } from "../../domain/interface/controller/IAuth.interface";
import { IUserUsecase } from "../../domain/interface/usecase/user.usecase";
import { ApiError } from "../../shared/helpers/apiError.helper";
import {
  LoginRequestDto,
  RefreshTokenRequestDto,
  SendOtpRequestDto,
  VerifyOtpRequestDto,
} from "../../application/dto/controller/auth/auth.request.dto";
import { IOtpUsecase } from "../../domain/interface/usecase/otp.usecase";
import {
  LoginResponseDto,
  SendOtpResponseDto,
  VerifyResponseDto,
} from "../../application/dto/controller/auth/auth.response.dto";
import { IConfigEnv } from "../../domain/interface/types/config.interface";
import { AuthenticatedRequest } from "../../domain/interface/middleware/jwtAuth.interface";

export class AuthController implements IAuthController {
  constructor(
    private _statusCode: Record<string, number>,
    private _message: Record<string, string>,
    private _userUsecase: IUserUsecase,
    private _otpUsecase: IOtpUsecase,
    private _env: IConfigEnv
  ) {}
  sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email)
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._message.FIELD_INVALID
        );
      const requestDto = new SendOtpRequestDto(email);
      const result = await this._otpUsecase.createOtp(requestDto);
      if (!result)
        throw new ApiError(
          this._statusCode.INTERNAL_SERVER_ERROR,
          this._message.SERVER_ERROR
        );
      const responseDto = new SendOtpResponseDto(result.otp);
      res
        .status(this._statusCode.OK)
        .json({ status: true, message: this._message.OTP_SEND, responseDto });
    } catch (error) {
      next(error);
    }
  };
  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp)
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._message.FIELD_MISSING
        );
      const requestDto = new VerifyOtpRequestDto(email, otp);
      const result = await this._otpUsecase.verifyOtp(requestDto);
      const repsonseDto = new VerifyResponseDto(result);
      res
        .status(this._statusCode.OK)
        .json({
          status: true,
          repsonseDto,
          message: this._message.OTP_VERIFYED,
        });
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._message.FIELD_MISSING
        );
      const requestDto = new LoginRequestDto(email, password);
      const result = await this._userUsecase.loginValidation(requestDto);
      if (!result)
        throw new ApiError(
          this._statusCode.UNAUTHORIZED,
          this._message.INVALID_CREDENTIALS
        );
      const responseDto = new LoginResponseDto(
        result.userId!,
        result.name!,
        result.email!
      );
      res.cookie("accessToken", result.accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: this._env.node_env === "production",
      });
      res.cookie("refreshToken", result.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: this._env.node_env === "production",
      });
      res.status(this._statusCode.OK).json({ status: true, responseDto });
    } catch (error) {
      next(error);
    }
  };
  refreshToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user;
      const requestDto = new RefreshTokenRequestDto(
        user?.userId!,
        user?.email!,
        user?.name!,
        user?.role!
      );
      const result = await this._userUsecase.refreshTokenValidation(requestDto);
      if (!result)
        throw new ApiError(
          this._statusCode.UNAUTHORIZED,
          this._message.INVALID_CREDENTIALS
        );
      res.cookie("accessToken", result.accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: this._env.node_env === "production",
      });
    } catch (error) {
      next(error);
    }
  };
  logout = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: this._env.node_env === "production",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: this._env.node_env === "production",
      });
      res
        .status(this._statusCode.OK)
        .json({ status: true, message: this._message.LOGOUT_SUCCESS });
    } catch (error) {
      next(error);
    }
  };
}

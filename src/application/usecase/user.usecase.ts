import { IOtpRepository } from "../../domain/interface/repository/otp.interface";
import { IUser } from "../../domain/interface/types/schem.interface";
import { CreateUsecaseRequestDto } from "../dto/usecase/user/user.request.dto";
import bcrypt from "bcrypt";
import {
  CreateUsecaseRepsonseDto,
  LoginValidationResponseDto,
  RefreshTokenResponseDto,
} from "../dto/usecase/user/user.response.dto";
import { IUserUsecase } from "../../domain/interface/usecase/user.usecase";
import { IUserRepository } from "../../domain/interface/repository/user.interface";
import { ApiError } from "../../shared/helpers/apiError.helper";
import { IGenerateData } from "../../domain/interface/util/generateData.interface";
import {
  ITOkenService,
  JwtPayload,
} from "../../domain/interface/util/jwt.interface";

export class UserUsecase implements IUserUsecase {
  constructor(
    private _userRepo: IUserRepository,
    private _otpRepo: IOtpRepository,
    private _statusCode: Record<string, number>,
    private _messages: Record<string, string>,
    private _generateData: IGenerateData,
    private _jwtService: ITOkenService
  ) {}
  create = async (data: Partial<IUser>): Promise<Partial<IUser> | null> => {
    const ValidOtp = await this._otpRepo.findByEmail({ email: data.email });
    if (!ValidOtp || ValidOtp.expiredAt > new Date())
      throw new ApiError(
        this._statusCode.BAD_REQUEST,
        this._messages.INVALID_OTP
      );
    const emailExist = await this._userRepo.findByEmail({ email: data.email });
    if (emailExist)
      throw new ApiError(
        this._statusCode.CONFLICT,
        this._messages.USER_EMAIL_ALREADY_EXISTS
      );

    const hashedPassword = await bcrypt.hash(data.password!, 10);
    const userId = this._generateData.generateUserId();
    const requestDto = new CreateUsecaseRequestDto(
      data.name!,
      data.email!,
      hashedPassword,
      data.role!,
      userId
    );
    const newUser = await this._userRepo.create(requestDto);
    if (!newUser) return null;
    return new CreateUsecaseRepsonseDto(
      newUser.userId!,
      newUser.name!,
      newUser.email!,
      newUser.role!
    );
  };

  checkName = async (data: Partial<IUser>): Promise<Partial<IUser> | null> => {
    return this._userRepo.findByName(data);
  };

  loginValidation = async (
    date: Partial<IUser>
  ): Promise<LoginValidationResponseDto | null> => {
    const user = await this._userRepo.findByEmail(date);
    if (!user) {
      throw new ApiError(
        this._statusCode.UNAUTHORIZED,
        this._messages.INVALID_CREDENTIALS
      );
    }
    const isPasswordVlide = await bcrypt.compare(
      date?.password!,
      user.password!
    );

    if (!isPasswordVlide)
      throw new ApiError(
        this._statusCode.UNAUTHORIZED,
        this._messages.INVALID_CREDENTIALS
      );
    const payload: JwtPayload = {
      userId: user?.userId!,
      name: user?.name!,
      email: user?.email!,
      role: user?.role,
    };
    const accessToken = this._jwtService.generateAccessToken(payload);
    const refreshToken = this._jwtService.generateRefreshToken(payload);
    return new LoginValidationResponseDto(
      user?.userId!,
      user?.name!,
      user?.email!,
      user?.role!,
      accessToken,
      refreshToken
    );
  };

  refreshTokenValidation = async (
    date: Partial<IUser>
  ): Promise<RefreshTokenResponseDto | null> =>{
        const payload: JwtPayload = {
      userId: date?.userId!,
      name: date?.name!,
      email: date?.email!,
      role: date?.role,
    };
    const accessToken = this._jwtService.generateAccessToken(payload);
    return new RefreshTokenResponseDto(
      accessToken
    )
  }
}

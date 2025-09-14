import { IOtpRepository } from "../../domain/interface/repository/otp.interface";
import {
  FindAllOptions,
  ISubmission,
  IUser,
} from "../../domain/interface/types/schem.interface";
import {
  CreateUsecaseRequestDto,
  SubmissionRequestDto,
} from "../dto/usecase/user/user.request.dto";
import bcrypt from "bcrypt";
import {
  CreateUsecaseRepsonseDto,
  LoginValidationResponseDto,
  RefreshTokenResponseDto,
  SubmissionResponseDto,
  UserReponseDto,
} from "../dto/usecase/user/user.response.dto";
import { IUserUsecase } from "../../domain/interface/usecase/user.usecase";
import { IUserRepository } from "../../domain/interface/repository/user.interface";
import { ApiError } from "../../shared/helpers/apiError.helper";
import { IGenerateData } from "../../domain/interface/util/generateData.interface";
import {
  ITOkenService,
  JwtPayload,
} from "../../domain/interface/util/jwt.interface";
import { ISubmissionRepository } from "../../domain/interface/repository/submission.interface";

export class UserUsecase implements IUserUsecase {
  constructor(
    private _userRepo: IUserRepository,
    private _otpRepo: IOtpRepository,
    private _statusCode: Record<string, number>,
    private _messages: Record<string, string>,
    private _generateData: IGenerateData,
    private _jwtService: ITOkenService,
    private _submissionRepo: ISubmissionRepository
  ) {}
  create = async (data: Partial<IUser>): Promise<Partial<IUser> | null> => {
    const ValidOtp = await this._otpRepo.findByEmail({ email: data.email });
    if (!ValidOtp || ValidOtp.expiredAt < new Date())
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
    if (!newUser)
      throw new ApiError(
        this._statusCode.NOT_FOUND,
        this._messages.TASK_NOT_FOUND
      );
    return new CreateUsecaseRepsonseDto(
      newUser.id!,
      newUser.userId!,
      newUser.name!,
      newUser.email!,
      newUser.role!
    );
  };

  checkName = async (data: Partial<IUser>): Promise<UserReponseDto | null> => {
    const result = await this._userRepo.findByName(data);
    if (!result)
      return null
    return new UserReponseDto(
      result.id!,
      result.userId!,
      result.name!,
      result.email!,
      result.role!,
      result.createdAt!,
      result.updatedAt!,
      result?.isDeleted!
    );
  };

  loginValidation = async (
    data: Partial<IUser>
  ): Promise<LoginValidationResponseDto | null> => {
    const user = await this._userRepo.findByEmail(data);
    if (!user) {
      throw new ApiError(
        this._statusCode.UNAUTHORIZED,
        this._messages.INVALID_CREDENTIALS
      );
    }
    if(user.role !== data.role){
      throw new ApiError(
        this._statusCode.UNAUTHORIZED,
        this._messages.ROLE_NOT_MATCHING
      )
    }
    const isPasswordVlide = await bcrypt.compare(
      data?.password!,
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
      id:user?.id!
    };
    const accessToken = this._jwtService.generateAccessToken(payload);
    const refreshToken = this._jwtService.generateRefreshToken(payload);
    return new LoginValidationResponseDto(
      user.id!,
      user?.userId!,
      user?.name!,
      user?.email!,
      user?.role!,
      accessToken,
      refreshToken
    );
  };

  refreshTokenValidation = async (
    date: Partial<IUser  & { id: string }>
  ): Promise<RefreshTokenResponseDto | null> => {
    const payload: JwtPayload = {
      userId: date?.userId!,
      name: date?.name!,
      email: date?.email!,
      role: date?.role,
      id:date?.id!
    };
    const accessToken = this._jwtService.generateAccessToken(payload);
    return new RefreshTokenResponseDto(accessToken);
  };
  update = async (
    userId: string,
    data: Partial<IUser>
  ): Promise<UserReponseDto | null> => {
    const result = await this._userRepo.update(userId, data);

    if (!result)
      throw new ApiError(
        this._statusCode.NOT_FOUND,
        this._messages.TASK_NOT_FOUND
      );

    return new UserReponseDto(
      result.id!,
      result.userId!,
      result.name!,
      result.email!,
      result.role!,
      result.createdAt!,
      result.updatedAt!,
      result?.isDeleted!
    );
  };
  findAllUsers = async (
    options: FindAllOptions
  ): Promise<UserReponseDto[] | null> => {
    const result = await this._userRepo.findAll(options);
    if (!result) return null;
    return result?.map(
      (result) =>
        new UserReponseDto(
          result.id!,
          result.userId!,
          result.name!,
          result.email!,
          result.role!,
          result.createdAt!,
          result.updatedAt!,
          result?.isDeleted!
        )
    );
  };

  submission = async (
    data: Partial<ISubmission>
  ): Promise<SubmissionResponseDto | null> => {
    const requestDto = new SubmissionRequestDto(
      this._generateData.generateSubmissionId(),
      data.taskId!,
      data.description!,
      data.documents!,
      data.userId!
    );
    const result = await this._submissionRepo.create(requestDto);
    if (!result) return null;
    return new SubmissionResponseDto(
      result?.id,
      result?.submissionId,
      result?.taskId,
      result?.description,
      result?.documents,
      result?.userId,
      result?.createdAt,
      result?.updatedAt,
      result.isVerified
    );
  };

  updateSubmission = async (
    id: string,
    data: Partial<ISubmission>
  ): Promise<SubmissionResponseDto | null> => {
    const result = await this._submissionRepo.update(id, data);

    if (!result)
      throw new ApiError(
        this._statusCode.NOT_FOUND,
        this._messages.TASK_NOT_FOUND
      );

    if (result.taskId.dueDate) {
      const dueDate = new Date(result.taskId.dueDate);
      const now = new Date();

      if (dueDate < now) {
        throw new ApiError(
          this._statusCode.BAD_REQUEST,
          this._messages.TASK_EXPIRED
        );
      }
    }

    return new SubmissionResponseDto(
      result?.id,
      result?.submissionId,
      result?.taskId,
      result?.description,
      result?.documents,
      result?.userId,
      result?.createdAt,
      result?.updatedAt,
      result.isVerified
    );
  };

  getSubmissions = async(data:Partial<ISubmission>):Promise<SubmissionResponseDto[] | null>=>{
    const result =await this._submissionRepo.findByTaskId(data);
    if(!result) return null
    return result?.map((data)=>
     new SubmissionResponseDto(
      data?.id,
      data?.submissionId,
      data?.taskId,
      data?.description,
      data?.documents,
      data?.userId,
      data?.createdAt,
      data?.updatedAt,
      data.isVerified
    )
    )
  }
}

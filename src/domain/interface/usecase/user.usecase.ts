import {
  LoginValidationResponseDto,
  RefreshTokenResponseDto,
  SubmissionResponseDto,
  UserReponseDto,
} from "../../../application/dto/usecase/user/user.response.dto";
import { FindAllOptions, ISubmission, IUser } from "../types/schem.interface";

export interface IUserUsecase {
  create(data: Partial<IUser>): Promise<Partial<IUser> | null>;
  checkName(data: Partial<IUser>): Promise<Partial<IUser> | null>;
  loginValidation(
    date: Partial<IUser>
  ): Promise<LoginValidationResponseDto | null>;
  refreshTokenValidation(
    date: Partial<IUser>
  ): Promise<RefreshTokenResponseDto | null>;
  update(userId: string, data: Partial<IUser>): Promise<UserReponseDto | null>;
  findAllUsers(options: FindAllOptions): Promise<UserReponseDto[] | null>;
  submission(data: Partial<ISubmission>): Promise<SubmissionResponseDto | null>;
  updateSubmission(
    id: string,
    data: Partial<ISubmission>
  ): Promise<SubmissionResponseDto | null>;
  getSubmissions(
    data: Partial<ISubmission>
  ): Promise<SubmissionResponseDto[] | null>;
}

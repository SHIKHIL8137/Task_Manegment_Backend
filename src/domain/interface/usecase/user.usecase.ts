import { LoginValidationResponseDto, RefreshTokenResponseDto } from "../../../application/dto/usecase/user/user.response.dto";
import { IUser } from "../types/schem.interface";

export interface IUserUsecase {
  create(data: Partial<IUser>): Promise<Partial<IUser> | null>;
  checkName(data: Partial<IUser>): Promise<Partial<IUser> | null>;
  loginValidation(
    date: Partial<IUser>
  ): Promise<LoginValidationResponseDto | null>;
  refreshTokenValidation(
      date: Partial<IUser>
    ): Promise<RefreshTokenResponseDto | null>
}

import { IOtpRepository } from "../../domain/interface/repository/otp.interface";
import { IUserRepository } from "../../domain/interface/repository/user.interface";
import { IOtp } from "../../domain/interface/types/schem.interface";
import { IOtpUsecase } from "../../domain/interface/usecase/otp.usecase";
import { IGenerateData } from "../../domain/interface/util/generateData.interface";
import { IMailer } from "../../domain/interface/util/mailer.interface";
import { ApiError } from "../../shared/helpers/apiError.helper";
import { createOtpRequestUsecaseDto } from "../dto/usecase/otp/otp.request.dto";
import { createOtpResponseUsecaseDto } from "../dto/usecase/otp/otp.response.dto";

export class OtpUsecase implements IOtpUsecase {
  constructor(
    private _otpRepo: IOtpRepository,
    private _userRepo: IUserRepository,
    private _statusCode: Record<string, number>,
    private _message: Record<string, string>,
    private _generateData: IGenerateData,
    private _Mailer : IMailer
  ) {}
  createOtp = async (data: Partial<IOtp>): Promise<IOtp | null> => {
    const emailExist = await this._userRepo.findByEmail(data);
    if (emailExist)
      throw new ApiError(
        this._statusCode.CONFLICT,
        this._message.USER_EMAIL_ALREADY_EXISTS
      );
    const otpExist = await this._otpRepo.findByEmail(data);
    if (otpExist) await this._otpRepo.findByEmailAndDelete(data);
    const newOtp = this._generateData.generateOtp()
    const requestDto = new createOtpRequestUsecaseDto(
      newOtp,
      data.email!,
      this._generateData.expiration()
    );
    this._Mailer.sendOTPEmail(data.email!,newOtp)
    const saved = await this._otpRepo.create(requestDto);
    return new createOtpResponseUsecaseDto(
      saved?.otp!,
      saved?.email!,
      saved?.expiredAt!,
      saved?.createdAt!
    );
  }
  verifyOtp = async(data:Partial<IOtp>):Promise<boolean>=>{
    const existingOtp =await this._otpRepo.findByEmail(data);
    if(!existingOtp || existingOtp.otp !== data.otp || existingOtp.email !== data.email || existingOtp.expiredAt < new Date()) throw new ApiError(this._statusCode.NOT_FOUND,this._message.INVALID_OTP)
    
    return true
  }
}

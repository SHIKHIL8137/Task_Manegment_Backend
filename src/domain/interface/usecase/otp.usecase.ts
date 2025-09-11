import { IOtp } from "../types/schem.interface";

export interface IOtpUsecase{
  createOtp (data:Partial<IOtp>):Promise<IOtp | null>;
  verifyOtp (data:Partial<IOtp>):Promise<boolean>;
}
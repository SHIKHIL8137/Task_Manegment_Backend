export class createOtpRequestUsecaseDto{
  constructor(
    public otp:number,
    public email:string,
    public expiredAt:Date
  ){}
}
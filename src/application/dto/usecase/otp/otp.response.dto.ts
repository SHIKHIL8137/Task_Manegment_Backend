export class createOtpResponseUsecaseDto{
  constructor(
    public otp:number,
    public email:string,
    public expiredAt:Date,
    public createdAt:Date
  ){}
}
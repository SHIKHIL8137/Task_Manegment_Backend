export class OTP{
  constructor(
   public otp:number,
   public email:string,
   public createdAt:Date,
   public expiredAt : Date
  ){}
}   
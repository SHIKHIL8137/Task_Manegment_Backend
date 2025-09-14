export class SendOtpResponseDto{
  constructor(
    public otp:number
  ){}
}

export class VerifyResponseDto{
  constructor(
    public verified:boolean
  ){}
}

export class LoginResponseDto{
  constructor(
    public id:string,
    public userId:string,
    public name :string,
    public email:string,
  ){}
}
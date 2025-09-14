export class SendOtpRequestDto {
  constructor(public email: string) {}
}

export class VerifyOtpRequestDto {
  constructor(public email: string, public otp: number) {}
}

export class LoginRequestDto {
  constructor(public email: string, public password: string,public role:string) {}
}

export class RefreshTokenRequestDto {
  constructor(
    public userId: string,
    public email: string,
    public name: string,
    public role?: string,
    public id?:string
  ) {}
}

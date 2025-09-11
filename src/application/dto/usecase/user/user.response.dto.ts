export class CreateUsecaseRepsonseDto{
  constructor(
    public userId:string,
    public name:string,
    public email:string,
    public role:string,
  ){}
}

export class LoginValidationResponseDto{
  constructor(
    public userId:string,
    public name:string,
    public email:string,
    public role:string,
    public accessToken:string,
    public refreshToken:string
  ){}
}

export class RefreshTokenResponseDto{
  constructor(
    public accessToken:string
  ){}
}
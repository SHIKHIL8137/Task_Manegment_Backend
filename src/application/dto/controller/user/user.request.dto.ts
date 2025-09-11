export class CreateUserRequestDto{
  constructor(
    public name:string,
    public email:string,
    public password:string,
    public otp:number,
    public role:string
  ){}
}

export class CheckNameRequestDto{
  constructor(
    public name:string
  ){}
}
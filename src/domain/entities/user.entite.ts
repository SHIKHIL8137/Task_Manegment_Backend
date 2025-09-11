export class User{
  constructor(
    public userId:string,
    public email:string,
    public name:string,
    public role:string,
    public isDeleted:boolean,
    public password:string
  ){}
}
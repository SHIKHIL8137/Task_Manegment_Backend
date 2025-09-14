export class UserResponseDto{
  constructor(
    public id:string,
    public userId:string,
    public name:string,
    public email:string,
    public createdAt:Date,
    public updatededAt:Date,
  ){}
}

export class SubmissionResponseDto{
  constructor(
    public submissionId:string,
    public taskId:{
      taskId:string,
      description:string,
      priority:string,
      status:string,
      title:string
    },
    public documents:string,
    public description:string,
    public createdAt:Date,
    public updatedAt:Date,
    public userId:{
      userId:string,
      name:string,
      email:string
    },
    public isVerified:boolean
  ){}
}
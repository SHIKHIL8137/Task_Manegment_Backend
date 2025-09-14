import { Types } from "mongoose";

export class CreateUserRequestDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public otp: number,
    public role: string
  ) {}
}

export class CheckNameRequestDto {
  constructor(public name: string) {}
}

export class DeleteUserRequestDto {
  constructor(public isDeleted: boolean) {}
}

export class SubmissionCreateRequestDto {
  public taskId: Types.ObjectId;
  public userId: Types.ObjectId;

  constructor(
    taskId: string,
    userId: string,
    public description: string,
    public documents: string
  ) {
    this.taskId = new Types.ObjectId(taskId);
    this.userId = new Types.ObjectId(userId);
  }
}

export class getSubmissionByTaskIdDto {
  public taskId: Types.ObjectId;
  constructor(taskId: string) {
    this.taskId = new Types.ObjectId(taskId);
  }
}

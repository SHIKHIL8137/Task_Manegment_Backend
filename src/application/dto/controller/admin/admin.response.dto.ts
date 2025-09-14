export class CreateTaskResponseDto {
  constructor(
    public id: string,
    public taskId: string,
    public title: string,
    public description: string,
    public dueDate: Date,
    public priority: string,
    public status: string,
    public createdAt: Date,
    public updatedAt: Date,
    public assignedUserId: {
      userId: string;
      email: string;
      name: string;
    }
  ) {}
}

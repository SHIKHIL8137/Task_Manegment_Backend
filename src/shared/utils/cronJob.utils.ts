import cron from "node-cron";
import { ITaskUsecase } from "../../domain/interface/usecase/task.usecase";
import { ICronJob } from "../../domain/interface/util/cornJob.interface";

export class CronJob implements ICronJob {
  constructor(private _taskUsecase: ITaskUsecase) {}
  checkTaskExpire = () => {
    cron.schedule("* * * * *", () => {
      console.log('cron activated')
      this._taskUsecase.checkTaskExpired();
    });
  };
}

import { Router } from "express";
import { IUserRoute } from "../../../domain/interface/routes/IUserRoute.interface";
import { IUserController } from "../../../domain/interface/controller/IUser.interface";
import { IMulter } from "../../../domain/interface/util/multer.interface";

export class UserRoute implements IUserRoute{
    private _router: Router;
  
    constructor(private _controller: IUserController, private _upload:IMulter) {
      this._router = Router();
      this.routes();
    }
  
    private  routes(): void {
      this._router.post("/register", this._controller.create);
      this._router.get("/check-name", this._controller.checkName);
      this._router.delete("/:userId",this._controller.delete);
      this._router.get("/",this._controller.findAll)
      this._router.post("/submission",this._controller.submitTask)
      this._router.post("/submission/upload",this._upload.secureSingleUpload,this._controller.uploadAttachment);
      this._router.get("/submisstion/:taskId",this._controller.getSubmissionByTaskId)
      this._router.patch('/submission',this._controller.updateSubmission)
    }
  
    public getRouter(): Router {
      return this._router;
    }
}
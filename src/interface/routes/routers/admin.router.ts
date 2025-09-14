import { Router } from "express";
import { IAdminRoute } from "../../../domain/interface/routes/IAdminRoute.interface";
import { IAdminController } from "../../../domain/interface/controller/IAdmin.interface";
import { IAuthentication } from "../../../domain/interface/middleware/jwtAuth.interface";

export class AdminRoute implements IAdminRoute{
    private _router: Router;
  
    constructor(private _controller: IAdminController,private _AuthGurd:IAuthentication) {
      this._router = Router();
      this.routes();
    }
  
    public routes(): void {
      this._router.post("/task", this._controller.create);
      this._router.patch("/task/:taskId ",this._controller.update);
      this._router.delete("/task/:taskId",this._controller.delete);
      this._router.patch("/task-update-status/:taskId",this._controller.updateStatus)
      this._router.get('/task',this._AuthGurd.accessTokenhandler,this._controller.findAllTask)
    }
  
    public getRouter(): Router {
      return this._router;
    }
}
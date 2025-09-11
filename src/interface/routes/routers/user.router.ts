import { Router } from "express";
import { IUserRoute } from "../../../domain/interface/routes/IUserRoute.interface";
import { IUserController } from "../../../domain/interface/controller/IUser.interface";

export class UserRoute implements IUserRoute{
    private _router: Router;
  
    constructor(private _controller: IUserController) {
      this._router = Router();
      this.routes();
    }
  
    private  routes(): void {
      this._router.post("/", this._controller.create);
      this._router.get("/check-name", this._controller.checkName);
    }
  
    public getRouter(): Router {
      return this._router;
    }
}
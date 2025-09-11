import { Router } from "express";
import { IAdminRoute } from "../../../domain/interface/routes/IAdminRoute.interface";
import { IAdminController } from "../../../domain/interface/controller/IAdmin.interface";

export class AdminRoute implements IAdminRoute{
    private _router: Router;
  
    constructor(private _controller: IAdminController) {
      this._router = Router();
      this.routes();
    }
  
    public routes(): void {
      this._router.get("/", this._controller.test);
    }
  
    public getRouter(): Router {
      return this._router;
    }
}
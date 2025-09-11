import { Router } from "express";

import { IAuthRoute } from "../../../domain/interface/routes/IAuthRoute.interface";
import { IAuthController } from "../../../domain/interface/controller/IAuth.interface";

export class AuthRoute implements IAuthRoute {
  private _router: Router;

  constructor(private _controller: IAuthController) {
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

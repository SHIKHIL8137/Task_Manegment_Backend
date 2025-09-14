import { Router } from "express";

import { IAuthRoute } from "../../../domain/interface/routes/IAuthRoute.interface";
import { IAuthController } from "../../../domain/interface/controller/IAuth.interface";
import { IAuthentication } from "../../../domain/interface/middleware/jwtAuth.interface";

export class AuthRoute implements IAuthRoute {
  private _router: Router;

  constructor(private _controller: IAuthController,private _authGurd:IAuthentication) {
    this._router = Router();
    this.routes();
  }

  public routes(): void {
    this._router.post("/otp-send", this._controller.sendOtp);
    this._router.post("/otp-verify", this._controller.verifyOtp);
    this._router.post("/login",this._controller.login)
    this._router.post("/refresh-token",this._authGurd.refreshTokenhandler,this._controller.refreshToken)
     this._router.get("/logout",this._controller.logout)
  }

  public getRouter(): Router {
    return this._router;
  }
}

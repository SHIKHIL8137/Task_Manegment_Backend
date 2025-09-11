import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "../../shared/helpers/apiError.helper";
import {
  ITOkenService,
  JwtPayload,
} from "../../domain/interface/util/jwt.interface";
import {
  AuthenticatedRequest,
  IAuthentication,
  IAuthorization,
} from "../../domain/interface/middleware/jwtAuth.interface";

export class Authentication implements IAuthentication {
  constructor(
    private _statusCode: Record<string, number>,
    private _message: Record<string, string>,
    private _tokenService: ITOkenService
  ) {}
  public accessTokenhandler: RequestHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;
      if (!token)
        throw new ApiError(
          this._statusCode.UNAUTHORIZED,
          this._message.UNAUTHORIZED
        );

      const decode = this._tokenService.verifyAccessToken(token);
      req.user = decode as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
    public refreshTokenhandler: RequestHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token)
        throw new ApiError(
          this._statusCode.UNAUTHORIZED,
          this._message.UNAUTHORIZED
        );

      const decode = this._tokenService.verifyRefreshToken(token);
      req.user = decode as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export class Authorization implements IAuthorization {
  constructor(
    private _statusCode: Record<string, number>,
    private _message: Record<string, string>
  ) {}
  public userAuth: RequestHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user?.role !== "user") {
      return res
        .status(this._statusCode.FORBIDDEN)
        .json({ message: this._message.FORBIDDEN });
    }
    next();
  };
  public adminAuth: RequestHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (req.user?.role !== "admin") {
      return res
        .status(this._statusCode.FORBIDDEN)
        .json({ message: this._message.FORBIDDEN });
    }
    next();
  };
}

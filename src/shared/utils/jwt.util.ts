import jwt,{ JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import { ITOkenService, JwtPayload } from '../../domain/interface/util/jwt.interface';

export class TokenService implements ITOkenService{
  constructor(private _accessSecret:string,private _refreshSecret:string){}
  generateAccessToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
    return jwt.sign(payload, this._accessSecret, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
    return jwt.sign(payload, this._refreshSecret, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): JwtPayload & DefaultJwtPayload  {
    return jwt.verify(token, this._accessSecret) as JwtPayload & DefaultJwtPayload ;
  }

  verifyRefreshToken(token: string): JwtPayload & DefaultJwtPayload  {
    return jwt.verify(token, this._refreshSecret) as JwtPayload & DefaultJwtPayload ;
  }
}
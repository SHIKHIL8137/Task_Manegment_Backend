import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email:string;
  name:string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface ITOkenService{
  generateAccessToken(payload: Omit<JwtPayload, "iat" | "exp">): string
  generateRefreshToken(payload: Omit<JwtPayload, "iat" | "exp">): string
  verifyAccessToken(token: string): JwtPayload & DefaultJwtPayload
  verifyRefreshToken(token: string): JwtPayload & DefaultJwtPayload
}
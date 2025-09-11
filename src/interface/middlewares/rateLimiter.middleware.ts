import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

export class RateLimter {
  public global: RateLimitRequestHandler;
  public login: RateLimitRequestHandler;
  public otp: RateLimitRequestHandler;
  constructor(messages: Record<string, string>) {
    
    this.global = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
      message: messages.TOO_MANY_REQUESTS,
    });

    this.login = rateLimit({
      windowMs: 5 * 60 * 1000,
      max: 5,
      message: messages.TOO_MANY_LOGIN_ATTEMPTS,
    });

    this.otp = rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 3,
      message: messages.TOO_MANY_OTP_REQUESTS,
    });
  }
}

import express from "express";
import Router from "./interface/routes/main.router";
import { ErrorHandler } from "./interface/middlewares/errorHandler.middleware";
import { App } from "./server";
import { configEnv } from "./infrastructure/config/env.config";
import { MongoDBConnection } from "./infrastructure/database/connection/mongoose.database";
import { RateLimter } from "./interface/middlewares/rateLimiter.middleware";
import { Messages } from "./shared/constents/message";

const errorHandler = new ErrorHandler();
const rateLimit = new RateLimter(Messages)
const dbConnection = new MongoDBConnection(configEnv.mongoose_string);
const server = new App(express(), Router, errorHandler.handle,[rateLimit.global],configEnv);


(async () => {
  await server.connectDB(dbConnection);
  server.listen();
})();

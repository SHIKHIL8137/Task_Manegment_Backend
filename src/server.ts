import express, {
  Application,
  Router as ExpressRouter,
  ErrorRequestHandler,
  RequestHandler,
} from "express";
import cookieParser from 'cookie-parser'
import { IDatabase } from "./domain/interface/dbConnect/IDb.interface";

export class App {
  constructor(
    private app: Application,
    private mainRouter: ExpressRouter,
    private errorHandler: ErrorRequestHandler,
    private middlewaresList : RequestHandler[] = []
  ) {
    this.config();
    this.routes();
    this.applyMiddlewares();
  }

  private config() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser())
  }

  private routes() {
    this.app.use("/api", this.mainRouter);
  }

  private applyMiddlewares() {
    this.middlewaresList.forEach(mw => this.app.use(mw))
    this.app.use(this.errorHandler);
  }

  public async connectDB(dbInstance: IDatabase) {
    await dbInstance.connect();
  }

  public listen(port: number) {
    this.app.listen(port, () => console.log(`Server running on port ${port}`));
  }
}

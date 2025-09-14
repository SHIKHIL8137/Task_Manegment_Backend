import express, {
  Application,
  Router as ExpressRouter,
  ErrorRequestHandler,
  RequestHandler,
} from "express";
import cookieParser from 'cookie-parser'
import { IDatabase } from "./domain/interface/dbConnect/IDb.interface";
import cors from 'cors'
import { IConfigEnv } from "./domain/interface/types/config.interface";

export class App {
  constructor(
    private _app: Application,
    private _mainRouter: ExpressRouter,
    private _errorHandler: ErrorRequestHandler,
    private _middlewaresList : RequestHandler[] = [],
    private _configenv:IConfigEnv
  ) {
    this.config();
    this.routes();
    this.applyMiddlewares();
  }

  private config() {
    this._app.use(cors({
    origin: this._configenv.frontend_url,
    credentials: true,
  }))
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cookieParser())
  }

  private routes() {
    this._app.use("/api", this._mainRouter);
  }

  private applyMiddlewares() {
    this._middlewaresList.forEach(mw => this._app.use(mw))
    this._app.use(this._errorHandler);
  }

  public async connectDB(dbInstance: IDatabase) {
    await dbInstance.connect();
  }

  public listen() {
    this._app.listen(this._configenv.port, () => console.log(`Server running on port ${this._configenv.port}`));
  }
}

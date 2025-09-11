import mongoose from "mongoose";
import { ApiError } from "../../../shared/helpers/apiError.helper";
import { HttpStatus } from "../../../shared/constents/httpStatus";
import { Messages } from "../../../shared/constents/message";
import { IDatabase } from "../../../domain/interface/dbConnect/IDb.interface";

export class MongoDBConnection implements IDatabase {
  constructor(private uri: string) {}

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      console.log("MongoDB connected");
    } catch (error) {
      throw new ApiError(HttpStatus.NOT_FOUND, Messages.MONGOOSE_STRING_NOT_FOUND);
    }
  }
}
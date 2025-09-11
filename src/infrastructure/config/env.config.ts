import dotenv from 'dotenv'
import { IConfigEnv } from '../../domain/interface/types/config.interface';
dotenv.config();


export const configEnv : IConfigEnv = {
  port: Number(process.env.PORT) || 3001,
  mongoose_string:process.env.MONGOOSE_CONNECTION_STRING || "",
  email: process.env.GMAIL || "",
  password: process.env.GMAIL_PASSWORD || "",
  accessSecret:process.env.ACCESS_SECRET || "",
  refreshSecret:process.env.REFRESH_SECRET || "",
  node_env:process.env.NODE_ENV || ""
}
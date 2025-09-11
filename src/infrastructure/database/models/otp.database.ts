import mongoose, { Schema } from "mongoose";
import { IOtp } from "../../../domain/interface/types/schem.interface";

interface IOtpDocument extends IOtp,Document{}

const otpSchema = new Schema<IOtpDocument>({
  otp:{
    type:Number,
    required:true
  },
  email:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    required:true,
    default: Date.now,
  },
  expiredAt:{
    type:Date,
    required:true
  }
})

otpSchema.index({createdAt:1},{expireAfterSeconds:600}) //10 minutes

const OtpModel = mongoose.models.Otp || mongoose.model<IOtpDocument>("Otp",otpSchema);
export default OtpModel
export type {IOtpDocument}
import { Model } from 'mongoose';
import  { IOtpDocument } from '../../../infrastructure/database/models/otp.database'
import { IOtp } from '../../../domain/interface/types/schem.interface';
import { OTP } from '../../../domain/entities/otp.entitie';
import { IOtpRepository } from '../../../domain/interface/repository/otp.interface';

export class OTPRepository implements IOtpRepository{
  constructor(private _model:Model<IOtpDocument>){}
  create = async(data:Partial<IOtp>):Promise<IOtp | null>=>{
    const doc = new this._model(data);
    const saved =  await doc.save();
    return new OTP(
      saved.otp,
      saved.email,
      saved.createdAt, 
      saved.expiredAt
    );
  }
  findByEmail = async(data:Partial<IOtp>):Promise<IOtp | null>=>{
    const result = await this._model.findOne(data)
    if(!result) return null
    return new OTP(
      result.otp,
      result.email,
      result.createdAt, 
      result.expiredAt
    )
  }
  findByEmailAndDelete = async(data:Partial<IOtp>):Promise<void>=>{
    await this._model.deleteMany(data);
  }
}
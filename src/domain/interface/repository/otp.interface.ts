import { IOtp } from "../types/schem.interface";

export interface IOtpRepository{
   create(data:Partial<IOtp>):Promise<IOtp | null>;
   findByEmail (data:Partial<IOtp>):Promise<IOtp | null>;
   findByEmailAndDelete (data:Partial<IOtp>):Promise<void>;
}
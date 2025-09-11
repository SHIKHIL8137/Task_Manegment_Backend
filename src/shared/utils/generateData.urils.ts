import moment from "moment";
import { IGenerateData } from "../../domain/interface/util/generateData.interface";

export class GenerateData implements IGenerateData{
  constructor() {}

  generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  expiration(): Date {
    return moment().add(10, "minutes").toDate();
  }

  generateUserId(): string {
    const prefix = "USER";
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `${prefix}${randomNumber}${randomLetter}`;
  }
}

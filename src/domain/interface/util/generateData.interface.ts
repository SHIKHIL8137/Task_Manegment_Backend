export interface IGenerateData {
  generateUserId(): string;
  generateOtp(): number;
  expiration(): Date;
  generateTaskId(): string;
  generateSubmissionId(): string 
}
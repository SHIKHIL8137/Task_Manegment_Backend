export interface IMailer{
  sendOTPEmail(email: string, otp: number): Promise<void> 
}
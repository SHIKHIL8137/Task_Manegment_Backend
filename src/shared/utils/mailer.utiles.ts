import nodemailer, { Transporter } from "nodemailer";
import { IMailer } from "../../domain/interface/util/mailer.interface";
export class Mailer implements IMailer {
  private transporter: Transporter;

  constructor(private _email: string, private _password: string) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this._email,
        pass: this._password,
      },
    });
  }

  async sendOTPEmail(email: string, otp: number): Promise<void> {
    const mailOptions = {
      from: this._email,
      to: email,
      subject: "Your Verification Code",
      html: this.buildOTPTemplate(otp),
    };

    await this.transporter.sendMail(mailOptions);
  }

  private buildOTPTemplate(otp: number): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4285F4; color: white; padding: 20px; text-align: center; }
          .verification-code { font-size: 32px; font-weight: bold; color: #4285F4; letter-spacing: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Verification Code</h1></div>
          <p>Hello,</p>
          <p>Please use the following verification code to complete your request:</p>
          <div class="verification-code">${otp}</div>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>The verification code will expire in 10 minutes.</p>
          <footer style="margin-top:20px;font-size:12px;color:#777;">&copy; 2025 DevConnect</footer>
        </div>
      </body>
      </html>
    `;
  }
}

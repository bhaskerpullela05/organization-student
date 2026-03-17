import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {

	constructor(private readonly Config:ConfigService){}

	private async getTransporter(){

		return nodemailer.createTransport({
			host: this.Config.getOrThrow<string>('MAILTRAP_HOST'),
			port: this.Config.getOrThrow<number>('MAILTRAP_PORT'),
			auth: {
				user: this.Config.getOrThrow<string>('MAILTRAP_USERNAME'),
				pass: this.Config.getOrThrow<string>('MAILTRAP_PASSWORD'),
			},
		});

	}

	async sendEmail(to:string, otp:string): Promise<void> {
		const transporter = await this.getTransporter();
		await transporter.sendMail({
			from: this.Config.getOrThrow<string>('MAILTRAP_USERNAME'),
			to,
			subject:'OTP for verification',
			html:`<h3>Your OTP is: ${otp}</h3>
                  <p>This OTP will expire in 5 minutes.</p>`
		});
	}

}

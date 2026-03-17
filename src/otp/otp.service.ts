import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { EmailService } from 'src/email/email.service';
import { ResetPassVeri } from 'src/users/dto/reserPassVeri.dto';
import { ResetPass } from 'src/users/dto/resetPass.dto';
import { VerifyDto } from 'src/users/dto/verify.dto';
import { Student } from 'src/users/entities/student.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpService {

	constructor(
		private Emailservice:EmailService,
		@InjectRedis() private redis:Redis,
		@InjectRepository(Student)
		private StudentRepo:Repository<Student>,
	){}

	GenerateOtp(){
		return Math.floor(100000+Math.random()*900000).toString();
	}

	async SendOtp(email:string){

		const Otp = this.GenerateOtp();

		await this.redis.set(`otp:${email}`, Otp, 'EX',300);

		return this.Emailservice.sendEmail(email,Otp);
	}	

	async VerifyOtp(dto:VerifyDto){

		const Key = `otp:${dto.email}`;

		const StoredOtp = await this.redis.get(Key);

		if(!StoredOtp){
			throw new Error ('Invalid or Expired Otp');
		}

		if(StoredOtp!==dto.otp){
			throw new UnauthorizedException('Invalid Otp');
		}

		await this.StudentRepo.update({email:dto.email},{email_verified:true});

		return 'Otp verified sucessfully'

	}

	async ResetPass(dto:ResetPass){
		
		const ExistingMail = await this.StudentRepo.findOne({where:{email:dto.email}});

		if(!ExistingMail){
			throw new UnauthorizedException('User not found');
		}

		const Otp = this.GenerateOtp();

		await this.redis.set(`Otp:${dto.email}`, Otp, 'EX',300);

		await this.Emailservice.sendEmail(dto.email, Otp);

		return 'Otp sent to Your email'

	}

	async ResetVerifyOtp(dto:VerifyDto){

		const Key = `Otp:${dto.email}`;

		const StoredOtp = await this.redis.get(Key);

		if(!StoredOtp){
			throw new UnauthorizedException('Expired Otp');
		}

		if(StoredOtp!==dto.otp){
			throw new BadRequestException('Invalid Otp');
		}

		const Token = Math.random().toString(36).substring(2, 15);

		await this.redis.set(`Token:${dto.email}`, Token, 'EX', 600);

		return{Token,message:'Otp verified Sucessfully'};

	}

	async ResetPassChan(dto:ResetPassVeri){

		const ExistingMail = await this.StudentRepo.findOne({where:{email:dto.email}});
		const Key = `Token:${dto.email}`;
		const StoredToken = await this.redis.get(Key);

		if(!StoredToken){
			throw new UnauthorizedException('Token Expired')
		}

		if(StoredToken!==dto.token){
			throw new BadRequestException('Invaild Token');
		}

		if(!ExistingMail){
			throw new UnauthorizedException('User not found');
		}

		if(dto.password!==dto.confirm_password){
			throw new BadRequestException ('Password Fields not matched');
		}

		const Hashed = await bcrypt.hash(dto.password,10);

		await this.StudentRepo.update({email:dto.email},{password:Hashed});

		return 'password changed sucessfully, you can login now with your new password';

	}

}


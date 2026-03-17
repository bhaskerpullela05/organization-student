import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class VerifyDto{

	@ApiProperty()
	@IsEmail()
	email:string;

	@ApiProperty()
	@IsString()
	otp:string;

}
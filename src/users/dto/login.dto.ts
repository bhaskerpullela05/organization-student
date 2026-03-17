import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto{

	@ApiProperty()
	@IsEmail()
	email:string;

	@ApiProperty()
	@IsString()
	@MinLength(3)
	@MaxLength(8)
	password:string;

}
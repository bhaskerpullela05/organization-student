import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ResetPass{

	@ApiProperty()
	@IsEmail()
	email:string;

}
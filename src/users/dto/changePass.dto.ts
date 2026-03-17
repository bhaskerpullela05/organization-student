import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class ChangePass{

	@ApiProperty()
	@IsString()
	old_password:string;

	@ApiProperty()
	@IsString()
	@MinLength(4)
	@MaxLength(8)
	Password:string;

	@ApiProperty()
	@IsString()
	confirm_password:string;

}
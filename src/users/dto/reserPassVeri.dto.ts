import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, Min, MinLength } from "class-validator";
import { StripTypeScriptTypesOptions } from "module";

export class ResetPassVeri{

	@ApiProperty()
	@IsEmail()
	email:string;

	@ApiProperty()
	@IsString()
	token:string;

	@ApiProperty()
	@IsString()
	@MinLength(4)
	@MaxLength(8)
	password:string;

	@ApiProperty()
	@IsString()
	@MinLength(4)
	@MaxLength(8)
	confirm_password:string;

}
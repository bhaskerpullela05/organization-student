import { IsEmail, IsEnum, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum CourseList{

	Backend_Developer = 'Backend Developer',
    Frontend_Developer = 'Frontend Developer',
    Fullstack_Developer = 'Fullstack Deveoper',
    Python_Devloper = 'Python Developer',
    Mbbs = 'Mbbs',
    ENT = 'ENT',
    Cardiology = 'Cardiology',
	Trading = 'Trading',
	LongTerm_Investment = 'LongTerm Investment',
	Crypto = 'Crypto',
	CA = 'CA',
	Lawyer = 'Lawyer'

}

export class RegisterDto {

	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsPhoneNumber('IN')
	Phone: string;

	@ApiProperty()
	@IsString()
	@MinLength(3)
	@MaxLength(8)
	password: string;

	@ApiProperty({
		enum:Object.values(CourseList),
		description:"select the course for student",
		enumName:'courses',
	})
	@IsEnum(CourseList)
	courselist:CourseList;

}

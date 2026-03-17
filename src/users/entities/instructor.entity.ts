import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";

@Entity()
export class Instructor{

	@PrimaryGeneratedColumn()
	id:number;

	@Column()
	name:string;

	@Column({unique:true})
	email:string;

	@Column()
	password:string;

	@ManyToMany(()=>Course, courses=>courses.instructors)
	courses:Course[]

}
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";
import { Student } from "./student.entity";

@Entity()
export class Lesson{

	@PrimaryGeneratedColumn()
	id:number;

	@Column()
	domain:string;

	@OneToMany(()=>Course, course=>course.lesson)
	courses:Course;

	@ManyToMany(()=>Student, students=>students.lesson)
	@JoinTable()
	student:Student[];

}
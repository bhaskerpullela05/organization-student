import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Lesson } from "./lesson.entity";
import { Instructor } from "./instructor.entity";
import { Student } from "./student.entity";

@Entity()
export class Course{

	@PrimaryGeneratedColumn()
	id:number;

	@Column()
	topic:string;

	@ManyToOne(()=>Lesson, lesson=>lesson.courses)
	lesson:Lesson;
    
	@ManyToMany(()=>Instructor, instructor=>instructor.courses)
	@JoinTable()
	instructors:Instructor[];

	@ManyToMany(()=>Student, student => student.courses)
    students: Student[];

}
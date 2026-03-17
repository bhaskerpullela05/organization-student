import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Lesson } from "./lesson.entity";
import { Course } from "./course.entity";
import { Role } from "./role.entity";

@Entity()
export class Student{

	@PrimaryGeneratedColumn()
	id:number;

	@Column()
	name:string;

	@Column({unique:true})
	email:string;

	@Column({unique:true})
	phone:string;

	@Column()
	password:string;

	@Column({ default: false })
    email_verified: boolean;

	@ManyToMany(()=>Lesson, lesson=>lesson.student)
	lesson:Lesson[];

	@ManyToMany(()=>Course, course => course.students)
    @JoinTable()
    courses: Course[];

	@ManyToOne(()=>Role, role=>role.student)
	@JoinTable()
	roles:Role;

}

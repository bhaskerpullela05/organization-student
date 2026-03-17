import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permissions } from "./permission.entity";
import { Student } from "./student.entity";

@Entity()
export class Role{

	@PrimaryGeneratedColumn()
	id:number;

	@Column()
	name:string;

	@Column()
	slug:string;

	@ManyToMany(()=>Permissions, permissions=>permissions.roles)
	@JoinTable()
	permissions:Permissions[]

	@OneToMany(()=>Student, student=>student.roles)
	student:Student[];

}
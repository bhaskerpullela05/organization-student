import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity()
export class Permissions{

	@PrimaryGeneratedColumn()
	id:number;

	@Column({unique:true})
	permission_name:string;

	@ManyToMany(()=>Role, role=>role.permissions)
	roles:Role[];

}
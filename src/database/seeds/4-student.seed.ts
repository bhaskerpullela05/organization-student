import { Role } from "../../users/entities/role.entity";
import { Course } from "../../users/entities/course.entity";
import { Student } from "../../users/entities/student.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
const bcrypt = require('bcrypt');

export default class StudentSeeder implements Seeder{
	public async run(datasource:DataSource):Promise<void>{

		console.log('student seed running');

		const StudentRepo = datasource.getRepository(Student);
		const CourseRepo = datasource.getRepository(Course);
		const RoleRepo = datasource.getRepository(Role);

		const Backend = await CourseRepo.findOneOrFail({where:{topic:"Backend Developer"}});
		const Frontend = await CourseRepo.findOneOrFail({where:{topic:"Frontend Developer"}});
		const Mbbs = await CourseRepo.findOneOrFail({where:{topic:"Mbbs"}});
		const Trading = await CourseRepo.findOneOrFail({where:{topic:"Trading"}});
		const Lawyer= await CourseRepo.findOneOrFail({where:{topic:"Lawyer"}});

		const HashedPassword = await bcrypt.hash('students', 10);
		const role = await RoleRepo.findOne({where:{slug:"student"}});

		if(!role){
			throw new Error('role not found');
		}

		const Data = [
	    {
			name: "Ravi",
			email: "ravi@gmail.com",
			phone: "9991110001",
			password:HashedPassword,
			role:role,
			topic:[Backend]
			
		},
		{
			name: "Priya",
			email: "priya@gmail.com",
			phone: "9991110002",
			password:HashedPassword,
			role:role,
			topic:[Frontend]
		
		},
		{
			name: "Arjun",
			email: "arjun@gmail.com",
			phone: "9991110003",
			password:HashedPassword,
			role:role,
			topic:[Mbbs]
		
		},
		{
			name:"Arun",
			email:"arun@gmail.com",
			phone:"5493656268",
			password:HashedPassword,
			role:role,
			topic:[Trading]
		},
		{
			name:"Lokesh",
			email:"lokesh@gmail.com",
			phone:"2212445145",
			password:HashedPassword,
			role:role,
			topic:[Lawyer]
		}
       ];

	   for(const data of Data){
		const student = StudentRepo.create({
			name:data.name,
			email:data.email,
			phone:data.phone,
			password:data.password,
			roles:role,
			courses:data.topic,
		});
		await StudentRepo.save(student);
	   }



	}
}


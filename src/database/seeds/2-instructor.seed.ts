import { Course } from "../../users/entities/course.entity";
import { Instructor } from "../../users/entities/instructor.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
const bcrypt = require('bcrypt');

export default class InstructorSeeder implements Seeder{
	public async run(datasource:DataSource):Promise<void>{

		console.log('Instructor seeding is running');

		const InstrucRepo = datasource.getRepository(Instructor);
		const CourseRepo = datasource.getRepository(Course);

		const Backend = await CourseRepo.findOneOrFail({where:{topic:"Backend Developer"}});
		const Frontend = await CourseRepo.findOneOrFail({where:{topic:"Frontend Developer"}});
		const Mbbs = await CourseRepo.findOneOrFail({where:{topic:"Mbbs"}});
		const Trading = await CourseRepo.findOneOrFail({where:{topic:"Trading"}});
		const Lawyer= await CourseRepo.findOneOrFail({where:{topic:"Lawyer"}});

		const hashedPassword = await bcrypt.hash('00000', 10);

		const Tutors = [
			{
				name:"Lecture-1",
				email:"lecture1@gmail.com",
				courses:[Backend],
				password: hashedPassword
			},
			{
				name:"Lecture-2",
				email:"lecture2@gmail.com",
				courses:[Frontend],
				password: hashedPassword
			},
			{
				name:"Lecture-3",
				email:"lecture3@gmail.com",
				courses:[Mbbs],
				password: hashedPassword
			},
			{
				name:"Lecture-4",
				email:"lecture4@gmail.com",
				courses:[Trading],
				password: hashedPassword
			},
			{
				name:"Lecture-5",
				email:"lecture5@gmail.com",
				courses:[Lawyer],
				password: hashedPassword
			}
		];

		for(const data of Tutors){
			const Instructor = InstrucRepo.create({
				name:data.name,
				email:data.email,
				password:data.password,
				courses:data.courses
			});

			await InstrucRepo.save(Instructor);
		}

	}
}
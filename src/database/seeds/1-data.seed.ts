import { Course } from "../../users/entities/course.entity";
import { Lesson } from "../../users/entities/lesson.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export default class Studentseeder implements Seeder{

	public async run(datasource:DataSource):Promise<void>{

		console.log('data seed is running');

		const CourseRepo = datasource.getRepository(Course);
		const LessonRepo = datasource.getRepository(Lesson);

		const Data = [

			{
				domain:"software",
				courses:[
					"Backend Developer",
					"Frontend Developer",
					"Fullstack Developer",
					"Python Devloper",
				]
			},

			{
				domain:"medical",
				courses:[
					"Mbbs",
					"ENT",
					"Cardiology",
				]
			},

			{
				domain:"finance",
				courses:[
					"Trading",
					"LongTerm Investment",
					"Crypto",
					"CA"
				]
			},

			{
				domain:"law",
				courses:[
					"Lawyer",
				]
			},

		];

		for(const item of Data){
			const Lesson = LessonRepo.create({
				domain:item.domain
			});

			const SavedDomains = await LessonRepo.save(Lesson);

			for(const topic of item.courses){
				const Course = CourseRepo.create({
					topic:topic,
					lesson:Lesson,
				});

				const SavedCourses = await CourseRepo.save(Course);
			}
		}

	}

}
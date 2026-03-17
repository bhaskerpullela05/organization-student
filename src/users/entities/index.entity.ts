import { Course } from "./course.entity";
import { Instructor } from "./instructor.entity";
import { Lesson } from "./lesson.entity";
import { Permissions } from "./permission.entity";
import { Role } from "./role.entity";
import { Student } from "./student.entity";

const entities = [Student,Lesson,Instructor,Course, Role,Permissions]

export{Student,Lesson,Instructor,Course,Role,Permissions}

export default entities;
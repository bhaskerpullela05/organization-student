import { ExcelSheet } from '../entities/excel.entity';
import { Course } from './course.entity';
import { Instructor } from './instructor.entity';
import { Lesson } from './lesson.entity';
import { Organization } from './organization.entity';
import { Permissions } from './permission.entity';
import { Role } from './role.entity';
import { Student } from './student.entity';
import { Subscription } from './subscription.entity';
import { Tutor } from './tutor.entity';

const entities = [
  Student,
  Lesson,
  Instructor,
  Course,
  Role,
  Permissions,
  ExcelSheet,
  Organization,
  Tutor,
  Subscription,
];

export {
  Student,
  Lesson,
  Instructor,
  Course,
  Role,
  Permissions,
  ExcelSheet,
  Organization,
  Tutor,
  Subscription,
};

export default entities;

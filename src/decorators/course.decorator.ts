import { SetMetadata } from '@nestjs/common';

export const COURSE_KEY = 'course';

export const Courses = (course: string) =>
  SetMetadata(COURSE_KEY, course);
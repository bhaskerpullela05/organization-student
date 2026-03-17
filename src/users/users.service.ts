import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { OtpService } from 'src/otp/otp.service';
import { ChangePass } from './dto/changePass.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Student)
    private StudentRepo: Repository<Student>,

    @InjectRepository(Role)
    private RoleRepo: Repository<Role>,

    @InjectRepository(Course)
    private CourseRepo: Repository<Course>,

    private jwtService: JwtService,

    private Emailservice: EmailService,

    private Otpservice: OtpService,
  ) {}

  async Register(dto: RegisterDto) {
    const ExistingMail = await this.StudentRepo.findOne({
      where: { email: dto.email },
    });
    if (ExistingMail) {
      throw new BadRequestException('email already exists');
    }

    const Role = await this.RoleRepo.findOne({ where: { slug: 'student' } });
    if (!Role) {
      throw new BadRequestException('no role found');
    }

    const Course = await this.CourseRepo.findOne({
      where: { topic: dto.courselist },
    });
    if (!Course) {
      throw new NotFoundException('course not found');
    }

    const HashedPassword = await bcrypt.hash(dto.password, 10);

    const Student = this.StudentRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.Phone,
      password: HashedPassword,
      roles: Role,
      courses: [Course],
    });

    await this.StudentRepo.save(Student);

    await this.Otpservice.SendOtp(dto.email);

    return { message: 'Registration Successfull, Otp sent to your email' };
  }

  async Login(dto: LoginDto) {
    const ExistingMail = await this.StudentRepo.findOne({
      where: { email: dto.email },
      relations: ['roles', 'courses'],
    });
    // console.log(ExistingMail?.courses);
    // console.log(ExistingMail?.roles);
    if (!ExistingMail) {
      throw new UnauthorizedException('User not found');
    }

    const Compare = await bcrypt.compare(dto.password, ExistingMail.password);
    if (!Compare) {
      throw new UnauthorizedException(
        'Password not matched please check again',
      );
    }

    const Payload = {
      sub: ExistingMail.email,
      role: ExistingMail.roles.slug,
      course: ExistingMail.courses.map((c) => c.topic),
    };
    const Token = this.jwtService.sign(Payload);
    console.log(Payload);

    return { access_token: Token };
  }

  async ChangePass(dto: ChangePass, email: string) {
    const ExistingMail = await this.StudentRepo.findOne({
      where: { email: email },
    });

    if (!ExistingMail) {
      throw new UnauthorizedException('Token Expired or Invalid Token');
    }

    const Compare = await bcrypt.compare(
      dto.old_password,
      ExistingMail.password,
    );
    if (!Compare) {
      throw new BadRequestException('Incorrect Old_password');
    }

    if (dto.Password !== dto.confirm_password) {
      throw new BadRequestException('Password fields not matched');
    }

    const Hashed = await bcrypt.hash(dto.Password, 10);

    await this.StudentRepo.update({ email: email }, { password: Hashed });

    return 'password changed sucessfully, you can login now with your new password';
  }

  async AdminRegister(dto: RegisterDto) {
    const Role = await this.RoleRepo.findOne({
      where: { slug: 'super-admin' },
    });
    if (!Role) {
      throw new BadRequestException('no role found');
    }

    const Course = await this.CourseRepo.findOne({
      where: { topic: dto.courselist },
    });
    if (!Course) {
      throw new NotFoundException('course not found');
    }

    const HashedPassword = await bcrypt.hash(dto.password, 10);

    const Student = this.StudentRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.Phone,
      password: HashedPassword,
      roles: Role,
      courses: [Course],
    });

    await this.StudentRepo.save(Student);
  }

  async GetStudentData() {
    const Students = await this.StudentRepo.find({
      relations: {
        courses: {
          instructors: true,
        },
      },
    });
    return Students;
  }

  async GetData(email: string) {
    const Student = await this.StudentRepo.findOne({
      where: { email: email },
      relations: {
        courses: {
          instructors: true,
        },
      },
      select: {
        id: true,
        name: true,
        email_verified: true,
        courses: {
          topic: true,
          instructors: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (Student?.email_verified === false) {
      throw new ConflictException('please verify your mail');
    }
    return {
      Student,
    };
  }

  async VerifyEmail(email: string) {
    await this.Otpservice.SendOtp(email);
    return 'OTP sent to your mail';
  }
}

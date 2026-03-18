import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DataSource, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { OtpService } from 'src/otp/otp.service';
import { ChangePass } from './dto/changePass.dto';
import { Course } from './entities/course.entity';
import * as ExcelJs from 'exceljs';
import * as XLSX from 'xlsx';
import { ExcelSheet } from './entities/excel.entity';
import { AddOrganizationDto } from './dto/add-organization.dto';
import { Organization } from './entities/organization.entity';
import { Tutor } from './entities/tutor.entity';
import { privateDecrypt } from 'crypto';
import { AddUserDto } from './dto/add-users.dto';

type ExcelRow = {
  name: string;
  email: string;
  password: string;
  course_name: string;
  is_active: boolean;
};

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(Student)
    private StudentRepo: Repository<Student>,

    @InjectRepository(Role)
    private RoleRepo: Repository<Role>,

    @InjectRepository(Course)
    private CourseRepo: Repository<Course>,

    @InjectRepository(ExcelSheet)
    private ExcelRepo: Repository<ExcelSheet>,

    @InjectRepository(Organization)
    private OrgRepo: Repository<Organization>,

    @InjectRepository(Tutor)
    private TutorRepo: Repository<Tutor>,

    private jwtService: JwtService,

    private Emailservice: EmailService,

    private Otpservice: OtpService,

    // DataSource gives us full transaction control
    private readonly dataSource: DataSource,
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

  async ExcelData(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // 2. Read Excel
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    if (!workbook.SheetNames.length) {
      throw new BadRequestException('Excel file has no sheets');
    }

    // 3. Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // 4. Convert to JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

    // 5. Prepare result array
    const data: ExcelRow[] = [];

    // 6. Loop rows
    rawData.forEach((row, index) => {
      const rowData: ExcelRow = {
        name: String(row.name || '').trim(),
        email: String(row.email || '').trim(),
        password: String(row.password || '').trim(),
        course_name: String(row.course_name || '').trim(),
        is_active:
          String(row.is_active || '')
            .toLowerCase()
            .trim() === 'true',
      };

      // 7. Validation
      if (!rowData.email) {
        throw new BadRequestException(`Missing email at row ${index + 2}`);
      }

      // 8. Push valid row
      data.push(rowData);
    });

    await this.ExcelRepo.save(data);

    // 9. Return data (you can save to DB here)
    return data;
  }

  generateExcel(data: any[]): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });
  }

  async exportUsersExcel(email: string): Promise<Buffer> {
    // 1. Fetch data from DB
    const users = await this.StudentRepo.find({
      where: { email },
      relations: {
        roles: true,
        courses: {
          instructors: true,
        },
      },
    });

    if (!users.length) {
      throw new NotFoundException('No data found');
    }

    // 2. Format data (flat structure for Excel)
    const formatted = users.map((u) => ({
      ID: u.id,
      Name: u.name,
      Email: u.email,
      Phone: u.phone,
      Role: u.roles.slug,
      Courses: u.courses.map((c) => c.topic).join(','),
      Insturctors: u.courses
        .flatMap((c) => c.instructors)
        .map((i) => i.name)
        .join(','),
      Insturctors_contact: u.courses
        .flatMap((c) => c.instructors)
        .map((i) => i.email)
        .join(','),
    }));

    // 3. Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(formatted);

    // 4. Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // 5. Return buffer
    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    });
  }

  async AddOrganization(dto: AddOrganizationDto) {
    const Exists = await this.OrgRepo.findOne({ where: { email: dto.email } });

    if (Exists) {
      throw new UnauthorizedException('user already exists');
    }
    const Hashed = await bcrypt.hash(dto.password, 10);
    const Org = this.OrgRepo.create({
      name: dto.name,
      email: dto.email,
      password: Hashed,
      max_limit: dto.max_limit,
    });
    await this.OrgRepo.save(Org);
    return 'organization added sucessfully';
  }

  /**
   * Atomically adds a tutor to an organization, respecting the max_limit.
   *
   * Uses a DB transaction with a PESSIMISTIC WRITE lock (SELECT … FOR UPDATE)
   * so that concurrent requests cannot both read count=9 and both insert,
   * which would bypass the limit.  Only one transaction can hold the write lock
   * on the organization row at a time.
   */
  async AddUsers(dto: AddUserDto, id: number) {
    // Quick duplicate email check BEFORE acquiring locks (cheap, non-critical)
    const Exists = await this.TutorRepo.findOne({
      where: { email: dto.email },
    });
    if (Exists) {
      throw new UnauthorizedException('user already exists');
    }

    return await this.dataSource.transaction(async (manager) => {
      // Lock the organization row → blocks other concurrent transactions
      const org = await manager.findOne(Organization, {
        where: { id },
        lock: { mode: 'pessimistic_write' }, // SELECT … FOR UPDATE
      });

      if (!org) {
        throw new UnauthorizedException('Organization not found');
      }

      // Re-count inside the transaction (fresh, locked read)
      const currentCount = await manager.count(Tutor, {
        where: { organization_id: id },
      });

      this.logger.log(
        `AddUsers: org ${id} → used=${currentCount}, max=${org.max_limit}`,
      );

      if (currentCount >= org.max_limit) {
        throw new BadRequestException(
          `Seat limit reached. Max allowed: ${org.max_limit}, currently used: ${currentCount}.`,
        );
      }

      const Hashed = await bcrypt.hash(dto.password, 10);
      const tutor = manager.create(Tutor, {
        name: dto.name,
        email: dto.email,
        password: Hashed,
        organization_id: id,
      });
      await manager.save(tutor);

      const remaining = org.max_limit - (currentCount + 1);
      return {
        message: 'Tutor added successfully',
        seats_remaining: remaining,
      };
    });
  }

  async OrgLogin(dto: LoginDto) {
    console.log(dto.email);
    console.log(dto.password);
    const ExistingMails = await this.OrgRepo.findOne({
      where: { email: dto.email },
      select: ['password', 'id', 'email'],
    });
    if (!ExistingMails) {
      throw new UnauthorizedException('User not found');
    }

    const Compare = await bcrypt.compare(dto.password, ExistingMails.password);
    if (!Compare) {
      throw new UnauthorizedException(
        'Password not matched please check again',
      );
    }
    console.log(ExistingMails.email, ExistingMails.id);
    const Payload = {
      sub: ExistingMails.email,
      id: ExistingMails.id,
      role: 'admin',
    };
    const Token = this.jwtService.sign(Payload);
    console.log(Payload);

    return { access_token: Token };
  }
}

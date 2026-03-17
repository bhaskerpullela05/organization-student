import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  StreamableFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Student } from './entities/student.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { OtpService } from 'src/otp/otp.service';
import { ResetPass } from './dto/resetPass.dto';
import { ResetPassVeri } from './dto/reserPassVeri.dto';
import { ChangePass } from './dto/changePass.dto';
import { UsersGuard } from 'src/guards/user.guard';
import { CourseGuard } from 'src/guards/course.guard';
import { Course } from './entities/course.entity';
import { Courses } from 'src/decorators/course.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,

    private Otpservice: OtpService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'student registration' })
  @ApiBody({ type: RegisterDto })
  async Register(@Body() dto: RegisterDto) {
    return this.usersService.Register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Student Login' })
  @ApiBody({ type: LoginDto })
  async Login(@Body() dto: LoginDto) {
    return this.usersService.Login(dto);
  }

  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Get('email-verify')
  async VerifyEmail(@Req() req: any) {
    return this.usersService.VerifyEmail(req.user.sub);
  }

  @Post('verify')
  @ApiOperation({ summary: 'otp verificaton' })
  @ApiBody({ type: VerifyDto })
  async Verifyotp(@Body() dto: VerifyDto) {
    return this.Otpservice.VerifyOtp(dto);
  }

  @Post('rest-password')
  @ApiOperation({ summary: 'reset-password-1' })
  @ApiBody({ type: ResetPass })
  async ResetPass(@Body() dto: ResetPass) {
    return this.Otpservice.ResetPass(dto);
  }

  @Post('reset-pass-verify')
  @ApiOperation({ summary: 'reset-password-2' })
  @ApiBody({ type: VerifyDto })
  async RestPassOtp(@Body() dto: VerifyDto) {
    return this.Otpservice.ResetVerifyOtp(dto);
  }

  @Post('reset-password-change-pass')
  @ApiOperation({ summary: 'reset-password-3' })
  @ApiBody({ type: ResetPassVeri })
  async ResetPassChan(@Body() dto: ResetPassVeri) {
    return this.Otpservice.ResetPassChan(dto);
  }

  @UseGuards(UsersGuard)
  @ApiBearerAuth()
  @Post('change-password')
  @ApiOperation({ summary: 'change password -Logedin user only' })
  @ApiBody({ type: ChangePass })
  async ChangePass(@Body() dto: ChangePass, @Req() req: any) {
    return this.usersService.ChangePass(dto, req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('Backend Developer')
  @Get('Backend-Developer-course')
  GetCourse() {
    return {
      message:
        'Welcome to Backend Developer course, Your content to learn is here',
    };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('Frontend Developer')
  @Get('Frontend-Developer-course')
  GetFrontendCourse() {
    return {
      message:
        'Welcome to Frontend Developer course, Your content to learn is here',
    };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('Fullstack Developer')
  @Get('Fullstack-Developer-course')
  GetFullstackCourse() {
    return {
      message:
        'Welcome to Fullstack Developer course, Your content to learn is here',
    };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('Python Developer')
  @Get('Python-Developer-course')
  GetPythonCourse() {
    return {
      message:
        'Welcome to Python Developer course, Your content to learn is here',
    };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('Mbbs')
  @Get('Mbbs-course')
  GetMbbsCourse() {
    return { message: 'Welcome to Mbbs course, Your content to learn is here' };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('ENT')
  @Get('ENT-course')
  GetEntCourse() {
    return { message: 'Welcome to ENT course, Your content to learn is here' };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('Cardiology')
  @Get('Cardiology-course')
  GetCardiologyCourse() {
    return {
      message: 'Welcome to Cardiology course, Your content to learn is here',
    };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('Trading')
  @Get('Trading-course')
  GetTradingCourse() {
    return {
      message: 'Welcome to Trading course, Your content to learn is here',
    };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('LongTerm Investment')
  @Get('LongTerm-Investment-course')
  GetLongTermCourse() {
    return {
      message:
        'Welcome to LongTerm Investment course, Your content to learn is here',
    };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('Crypto')
  @Get('Crypto-course')
  GetCryptoCourse() {
    return {
      message: 'Welcome to Crypto course, Your content to learn is here',
    };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('CA')
  @Get('CA-course')
  GetCaCourse() {
    return { message: 'Welcome to CA course, Your content to learn is here' };
  }

  @ApiBearerAuth()
  @UseGuards(CourseGuard)
  @Courses('Lawyer')
  @Get('Lawyer-course')
  GetLawyerCourse() {
    return {
      message: 'Welcome to Lawyer course, Your content to learn is here',
    };
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Get('super-admin-panel')
  @Roles('super-admin')
  @ApiOkResponse({ description: 'Welcome to the Super Admin panel' })
  @ApiForbiddenResponse({
    description: 'Access Denied: Requires Super Admin Role',
  })
  GetStudentData() {
    return this.usersService.GetStudentData();
  }
  @Post()
  @Roles('super-admin')
  @ApiOperation({ summary: 'admin register' })
  async AdminRegister(@Body() dto: RegisterDto) {
    return this.usersService.AdminRegister(dto);
  }
  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Get('Dashboard')
  async GetData(@Req() req: any) {
    return this.usersService.GetData(req.user.sub);
  }

  @Get('download')
  downloadFile(): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), 'src/uploads/testing.png'),
    );
    return new StreamableFile(file, {
      type: 'image/png',
    });
  }
}

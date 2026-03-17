import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CourseGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiredCourse = this.reflector.getAllAndOverride<string>(
      'course',
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.split(' ')[1];

    try {

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
      });

      request.user = payload;
      console.log(payload);

      if (!requiredCourse) return true;

      if (!payload.course || !payload.course.includes(requiredCourse)) {
        throw new ForbiddenException(
          'You are not enrolled in this course',
        );
      }

      return true;

    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
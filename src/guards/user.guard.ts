import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { request } from 'https';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(
    private Jwt: JwtService,
    private Config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const Request = context.switchToHttp().getRequest();
    const Token = this.extractTokenFromHeader(Request);

    if (!Token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const Payload = await this.Jwt.verifyAsync(Token, {
        secret: this.Config.getOrThrow<string>('JWT_SECRET'),
      });

      Request.user = Payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

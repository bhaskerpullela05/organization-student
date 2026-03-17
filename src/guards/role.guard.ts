import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private Ref: Reflector,
    private Jwt: JwtService,
	private Config:ConfigService,
  ) {} 

  async canActivate(context: ExecutionContext): Promise<boolean> {
  const requiredRoles = this.Ref.getAllAndOverride<string[]>(Roles_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  const Request = context.switchToHttp().getRequest();
  const AuthHeader = Request.headers.authorization;

  if (!AuthHeader) throw new UnauthorizedException('Token missing');

  const Token = AuthHeader.split(' ')[1];

  try {
    //  Verify and Decode
    const Payload = await this.Jwt.verifyAsync(Token, {
      secret: this.Config.getOrThrow<string>('JWT_SECRET'), 
    });

    //console.log('User Payload:', payload);
    
    Request.user = Payload;
	console.log(Payload);

    if (!requiredRoles) return true;

	
    if (!Payload.role || !Payload.role.includes(requiredRoles)) {
      console.log(`Access Denied for role: ${Payload.role}`);
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true; // Only returns true if roles match!

  } catch (err) {
    if (err instanceof ForbiddenException) throw err;
    throw new UnauthorizedException('Invalid or expired token');
  }
}

 }

import { SetMetadata } from '@nestjs/common';

export const Roles_KEY = 'role';

export const Roles = (role: string) =>
  SetMetadata(Roles_KEY, role);
import { SetMetadata } from '@nestjs/common'
import { UserRole } from '../types'

export const SetAccessRoles = (...roles: UserRole[]) => SetMetadata('roles', roles)

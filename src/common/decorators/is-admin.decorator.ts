import { SetMetadata } from '@nestjs/common'

export const IS_ADMIN_ROUTE = 'IS_ADMIN_ROUTE'
export const IsAdmin = () => SetMetadata(IS_ADMIN_ROUTE, true)

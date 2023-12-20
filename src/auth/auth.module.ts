import { Module } from '@nestjs/common'
import { RegisterService } from './register/register.service'
import { LoginService } from './login/login.service'
import { LogoutService } from './logout/logout.service'
import { AuthController } from './auth.controller'

@Module({
    providers: [RegisterService, LoginService, LogoutService],
    controllers: [AuthController],
})
export class AuthModule {}

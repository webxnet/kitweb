import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { RegisterService } from './register/register.service'
import { LoginService } from './login/login.service'
import { LogoutService } from './logout/logout.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [RegisterService, LoginService, LogoutService],
    controllers: [AuthController],
})
export class AuthModule {}

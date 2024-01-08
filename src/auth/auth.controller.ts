import { IsPublic } from '@common/decorators/is-public.decorator'
import { CreateUserDto } from '@common/dto/create-user.dto'
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { LoginService } from './login/login.service'
import { RegisterService } from './register/register.service'
import { LoginDTO } from '@common/dto/login.dto'

@Controller()
export class AuthController {
    constructor(
        private registerService: RegisterService,
        private readonly loginService: LoginService,
    ) {}

    @IsPublic()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() createUserDto: CreateUserDto) {
        return this.registerService.register(createUserDto)
    }

    @IsPublic()
    //@UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() credentials: LoginDTO) {
        return await this.loginService.login(credentials)
    }
}

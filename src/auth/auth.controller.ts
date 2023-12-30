import { CreateUserDto } from '@common/dto/create-user.dto'
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { RegisterService } from './register/register.service'

@Controller()
export class AuthController {
    constructor(private registerService: RegisterService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.registerService.register(createUserDto)
    }
}

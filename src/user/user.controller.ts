import { Body, Controller, Post } from '@nestjs/common'
import { IsPublic } from '../common/decorators/is-public.decorator'
import { CreateUserDto } from '../common/dto/create-user.dto'
import { UserService } from './user.service'

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @IsPublic()
    @Post('user')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }
}

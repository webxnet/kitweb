import {
    Body,
    Controller,
    Param,
    Patch,
    Get,
    Post,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { IsPublic } from '@common/decorators/is-public.decorator'
import { CreateUserDto } from '@common/dto/create-user.dto'
import { UserService } from './user.service'
import { User } from '@common/entities/user.entity'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import { diskStorage } from 'multer'
import { UpdateUserDto } from '@common/dto/update-user.dto'
import { IsAdmin } from '@common/decorators/is-admin.decorator'

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @IsPublic()
    @Post('user')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }

    @IsAdmin()
    @Get('users')
    getUsers() {
        return this.userService.getUsers()
    }

    @IsAdmin()
    @Get('user/:username')
    getUserByUsername(@Param() params) {
        return this.userService.getUserByUsername(params.username)
    }

    @Get('me')
    getMe(@CurrentUser() user: User) {
        return user
    }

    @Patch(':id')
    //@UseGuards(LocalAuthGuard)
    //@UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar', { storage: diskStorage({}) }))
    async updateUser(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const buffer = file ? await fs.readFile(file.path) : undefined
        return await this.userService.updateUser(
            id,
            updateUserDto,
            buffer,
            file?.mimetype,
            file?.originalname,
            req,
            res,
        )
    }
}

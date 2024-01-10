import { CurrentUser } from '@common/decorators/current-user.decorator'
import { IsPublic } from '@common/decorators/is-public.decorator'
import { SetAccessRoles } from '@common/decorators/set-access-roles.decorator'
import { CreateUserDto } from '@common/dto/create-user.dto'
import { UpdateUserDto } from '@common/dto/update-user.dto'
import { User } from '@common/entities/user.entity'
import { AdminGuard } from '@common/guards/admin.guard'
import { UserRole } from '@common/types'
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import { diskStorage } from 'multer'
import { UserService } from './user.service'

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @IsPublic()
    @Post('user')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
    }

    @SetAccessRoles(UserRole.ADMIN)
    @UseGuards(AdminGuard)
    @Get('users')
    getUsers() {
        return this.userService.getUsers()
    }

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

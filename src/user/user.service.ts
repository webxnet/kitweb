import { CreateUserDto } from '@common/dto/create-user.dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(createUserDto: CreateUserDto) {
        const { email, username } = createUserDto

        // check if email already exists
        const emailExists = await this.prisma.user.findUnique({
            where: { email },
        })

        if (emailExists) {
            throw new BadRequestException(`email: '${email}' is already registered.`)
        }

        // check if user already exists
        const userNameExists = await this.prisma.user.findUnique({
            where: { username },
        })

        if (userNameExists) {
            throw new BadRequestException(`username: '${username}' is already registered.`)
        }

        // create user with prisma
        const createdUser = await this.prisma.user.create({
            data: {
                username: createUserDto.username,
                email: createUserDto.email,
                // save hashed password from the current password
                password: await bcrypt.hash(createUserDto.password, 10),
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
            },
        })
        return {
            ...createdUser,
            password: undefined,
        }
    }
}

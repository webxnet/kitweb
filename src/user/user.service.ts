import { CreateUserDto } from '@common/dto/create-user.dto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { S3Service } from '@s3/s3.service'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from '@common/dto/update-user.dto'

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private s3Service: S3Service,
    ) {}

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

    async getUsers() {
        const countItems = await this.prisma.user.count()
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                avatarUrl: true,
                email: true,
            },
            orderBy: {
                username: 'asc',
            },
        })

        return { countItems, users }
    }

    async findOneByEmailAndPassword(email: string, password: string) {
        return await this.prisma.user.findFirst({
            where: {
                AND: {
                    email: email,
                    password: password,
                },
            },
        })
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } })
    }

    async getUserByUsername(username: string) {
        const userName = await this.prisma.user.findUnique({
            where: { username },
            select: {
                username: true,
                email: true,
            },
        })

        // if no user is found, throw an error
        if (!userName) {
            throw new BadRequestException('Something went wrong. Please try again.')
        }

        return userName
    }

    async updateTokenUser(id: string, refreshToken: string) {
        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                refreshToken: refreshToken,
            },
            select: {
                id: true,
                email: true,
                refreshToken: true,
            },
        })
    }

    async updateUser(
        id: string,
        updateUserDto: UpdateUserDto,
        buffer: Buffer | undefined,
        mimetype: string | undefined,
        originalname: string | undefined,
        req: any,
        res: any,
    ) {
        // get the user id from the JWT token
        const userId = req.user.id

        // get user from the database
        const user = await this.prisma.user.findUnique({ where: { id: id } })

        // if no user is found, throw an error
        if (!user) {
            throw new NotFoundException('User not found')
        }

        // check if userId from token equals the id from the request params
        if (user.id !== userId) {
            throw new BadRequestException('You are not authorized to edit this profile.')
        }

        // initialize the avatarUrl as existing or undefined
        let avatarUrl: string | undefined = user.avatarUrl

        // check if user is trying to update the avatar, delete the old avatar from S3 and upload the new one
        if (buffer && mimetype && originalname) {
            if (avatarUrl) {
                const oldKey = avatarUrl.split('.amazonaws.com/')[1]
                await this.s3Service.deleteImage(oldKey)
            }
            const username = req.user.username
            const key = `${username}-${Date.now()}-${originalname}`
            avatarUrl = await this.s3Service.uploadImage(buffer, mimetype, key)
        }

        // updateData spread the updateUserDto and add the avatarUrl
        const updateData: Record<string, any> = {
            ...(updateUserDto.email !== undefined && { email: updateUserDto.email }),
            ...(updateUserDto.username !== undefined && {
                username: updateUserDto.username,
            }),
            avatarUrl,
        }
        // check if user is trying to update the username
        if (updateUserDto.username) {
            const existingUsername = await this.prisma.user.findUnique({
                where: { username: updateUserDto.username },
            })

            if (existingUsername) {
                throw new BadRequestException('Username already taken')
            }

            updateData.username = updateUserDto.username
        }

        // check if user is trying to update the email
        if (updateUserDto.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            })

            if (existingEmail) {
                throw new BadRequestException('Email already taken.')
            }

            updateData.email = updateUserDto.email
        }

        // update the user
        const updateUser = await this.prisma.user.update({
            where: {
                id: id,
            },
            data: updateData,
        })

        // check if the user was updated
        if (updateUser) {
            return res.status(200).json({
                message: 'User updated successfully',
                avatarUrl,
            })
        } else {
            throw new BadRequestException('Oops! Something went wrong.')
        }
    }
}

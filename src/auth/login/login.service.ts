import { User } from '@common/entities/user.entity'
import { UnauthorizedError } from '@common/errors/unauthorized.error'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@user/user.service'
import * as bcrypt from 'bcrypt'
import { LoginDTO } from '@common/dto/login.dto'
import { LoginResponseInterface } from '@common/models/login.interface'
import { UserPayload } from '@common/models/UserPayload'

@Injectable()
export class LoginService {
    private readonly saltRounds = 10
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async login(credentials: LoginDTO): Promise<LoginResponseInterface> {
        const { email, password } = credentials
        const user = await this.userService.findOneByEmailAndPassword(email, password)
        if (!user) throw new BadRequestException('Email or password incorrect')
        const refreshToken = await this.generateRefreshToken({
            sub: user.id,
            username: user.username,
            email: user.email,
        })
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, this.saltRounds)
        const accessToken = await this.generateAccessToken({
            sub: user.id,
            username: user.username,
            email: user.email,
        })
        await this.userService.updateTokenUser(user.id, hashedRefreshToken)
        const response: LoginResponseInterface = {
            status: 'success',
            message: 'Login successfully',
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        }
        return response
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.findByEmail(email)

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (isPasswordValid) {
                return {
                    ...user,
                    password: undefined,
                }
            }
        }

        throw new UnauthorizedError('Email address or password provided is incorrect.')
    }

    private async generateAccessToken(payload: UserPayload): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '20s',
        })
    }

    private async generateRefreshToken(payload: UserPayload): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        })
    }
}

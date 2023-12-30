import { AuthResponse } from '@common/dto/auth-response.dto'
import { CreateUserDto } from '@common/dto/create-user.dto'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@user/user.service'

@Injectable()
export class RegisterService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
        const user = await this.userService.createUser(createUserDto)
        return {
            token: this.jwtService.sign({ username: user.username }),
            user,
        }
    }
}

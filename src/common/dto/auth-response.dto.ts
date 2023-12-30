import { User } from '../entities/user.entity'

export class AuthResponse {
    token: string
    user: User
}

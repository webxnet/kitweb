import { Module } from '@nestjs/common'
import { PrismaModule } from '@prisma/prisma.module'
import { S3Service } from '@s3/s3.service'
import { UserController } from '@user/user.controller'
import { UserService } from '@user/user.service'

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, S3Service],
    exports: [UserService],
})
export class UserModule {}

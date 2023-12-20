import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import * as path from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { PrismaService } from './prisma/prisma.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'

@Module({
    imports: [
        PrismaModule,
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
                watch: true,
            },
            resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import * as path from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { PrismaService } from './prisma/prisma.service'
import { UserModule } from './user/user.module'

@Module({
    imports: [
        PrismaModule,
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            fallbacks: {
                'pt-*': 'pt',
                'en-*': 'en',
                'pt_*': 'pt',
                'en_*': 'en',
                en: 'en',
                pt: 'pt',
            },
            loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
                watch: true,
            },
            typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
                new HeaderResolver(['x-lang']),
            ],
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

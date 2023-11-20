import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import * as path from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
    imports: [
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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

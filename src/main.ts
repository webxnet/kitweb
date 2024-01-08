import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n'
import { AppModule } from './app.module'
import * as fs from 'fs'

const httpsOptions = {
    key: fs.readFileSync('./cert.key'),
    cert: fs.readFileSync('./cert.crt'),
}

async function bootstrap() {
    const logger = new Logger('Main')
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions })
    app.setViewEngine('hbs')
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
        new I18nValidationPipe(),
    )

    app.useGlobalFilters(
        new I18nValidationExceptionFilter({
            detailedErrors: false,
        }),
    )

    app.enableVersioning({
        type: VersioningType.URI,
    })
    const config = app.get<ConfigService>(ConfigService)
    const port = config.get<number>('SERVER_PORT') || 3000
    const nodeEnv = config.get<string>('NODE_ENV')
    const basePath = config.get<string>('BASEPATH')
    await app.listen(port, () => {
        logger.log(`🚀 Application is running on: ${basePath}:${port}/`)
        //${globalPrefix}
        logger.log(`Running in mode: ${nodeEnv} `)
    })
}
bootstrap()

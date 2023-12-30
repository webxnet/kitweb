import { IsPublic } from '@common/decorators/is-public.decorator'
import { Controller, Get, Render } from '@nestjs/common'
import { I18n, I18nContext } from 'nestjs-i18n'
import { AppService } from './app.service'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get()
    @IsPublic()
    @Render('index')
    render() {
        const message = this.appService.getHello()
        return { message }
    }

    @Get('/hello')
    @IsPublic()
    async getHello(@I18n() i18n: I18nContext) {
        return await i18n.t('webxnet.Hello')
    }

    @Get('/ping')
    ping(): 'pong' {
        return 'pong'
    }
}

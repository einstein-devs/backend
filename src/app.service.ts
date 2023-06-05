import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    //     constructor(private mailerService: MailerService) {}
    //   async enviarEmail(email: string, mensagem: string) {
    //     await this.mailerService.sendMail({
    //       to: email,
    //       from: 'wesley.gado@treinaweb.com.br',
    //       subject: 'Enviando Email com NestJS',
    //       html: `<h3 style="color: red">${mensagem}</h3>`,
    //     });
    //   }
    //     @Get('email')
    //     @Render('form')
    //     exibirForm() {
    //         //
    //     }
    //     @Post('enviar-email')
    //     enviarEmail(@Request() req) {
    //         return this.appService.enviarEmail(req.body.email, req.body.mensagem);
    //     }
}

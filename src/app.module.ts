import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CentroModule } from './modules/centro/centro.module';
import { CertificadoModule } from './modules/certificado/certificado.module';
import { CursoModule } from './modules/curso/curso.module';
import { EventoModule } from './modules/evento/evento.module';
import { LocalModule } from './modules/local/local.module';
import { PresencaModule } from './modules/presenca/presenca.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { UsuarioService } from './modules/usuario/usuario.service';

@Global()
@Module({
    imports: [
        LocalModule,
        CertificadoModule,
        AuthModule,
        PresencaModule,
        CentroModule,
        CursoModule,
        EventoModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                secure: false,
                port: 587,
                auth: {
                    user: 'eventonsuporte@gmail.com',
                    pass: 'jyuowrilwuuthlts',
                },
                ignoreTLS: false,
            },
            defaults: {
                from: '"',
            },
            template: {
                dir: join(__dirname, 'mails'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [AppController],
    providers: [PrismaService, UsuarioService],
    exports: [PrismaService, UsuarioService],
})
export class AppModule {}

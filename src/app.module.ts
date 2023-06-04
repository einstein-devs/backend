import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ],
    controllers: [AppController],
    providers: [PrismaService, UsuarioService],
    exports: [PrismaService, UsuarioService],
})
export class AppModule {}

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PresencaModule } from './modules/presenca/presenca.module';
import { LocalModule } from './modules/local/local.module';
import { EventoModule } from './modules/evento/evento.module';
import { APP_GUARD } from '@nestjs/core';
import { CargoGuard } from './guards/cargo.guard';
import { UsuarioService } from './modules/usuario/usuario.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { CertificadoModule } from './modules/certificado/certificado.module';

@Global()
@Module({
    imports: [
        LocalModule,
        CertificadoModule,
        AuthModule,
        PresencaModule,
        EventoModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [],
    providers: [PrismaService, UsuarioService],
    exports: [PrismaService, UsuarioService],
})
export class AppModule {}

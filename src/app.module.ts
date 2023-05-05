import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PresencaModule } from './modules/presenca/presenca.module';
import { LocalModule } from './modules/local/local.module';
import { EventoModule } from './modules/evento/evento.module';

@Module({
    imports: [
        LocalModule,
        AuthModule,
        PresencaModule,
        EventoModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}

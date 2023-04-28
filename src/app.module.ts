import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PresencaModule } from './modules/presenca/presenca.module';
import { EventoModule } from './modules/evento/event.module';

@Module({
  imports: [
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

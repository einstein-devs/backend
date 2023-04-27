import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PresencaModule } from './modules/presenca/presenca.module';
import { EventModule } from './modules/evento/event.module';
import { LocalModule } from './modules/local/local.module';



@Module({
  imports: [
    LocalModule,
    AuthModule,
    PresencaModule,
    EventModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

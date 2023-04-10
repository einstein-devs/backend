import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsuarioController } from './modules/usuario/usuario.controller';
import { UsuarioService } from './modules/usuario/usuario.service';
import { UsuarioModule } from './modules/usuario/usuario.module';



@Module({
  imports: [
    AuthModule,
    UsuarioModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

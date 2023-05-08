import { Module } from '@nestjs/common';
import { CertificadoController } from './certificado.controller';
import { CertificadoService } from './certificado.service';

@Module({
    imports: [],
    providers: [CertificadoService],
    controllers: [CertificadoController],
})
export class CertificadoModule {}

import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CargoGuard } from 'src/guards/cargo.guard';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CertificadoService } from './certificado.service';
import { CreateCertificadoDto } from './dtos/create-certificado.dto';

@UseGuards(JwtAuthGuard)
@Controller('/certificados')
export class CertificadoController {
    constructor(private readonly certificadoService: CertificadoService) {}

    @Get()
    async getCertificados(@Req() req) {
        const usuarioId: string = req.user.id;
        const certificados = await this.certificadoService.getCertificados(
            usuarioId,
        );
        return new DefaultResponseDTO(certificados);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async gerarCertificado(
        @Req() req,
        @Body() createCertificadoDto: CreateCertificadoDto,
    ) {
        const usuarioId: string = req.user.id;
        const certificadoGerado =
            await this.certificadoService.gerarCertificado(
                usuarioId,
                createCertificadoDto,
            );
        return new DefaultResponseDTO(
            certificadoGerado,
            'Certificado de evento gerado com sucesso!',
        );
    }
}

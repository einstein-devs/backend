import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CargoPosicao } from '@prisma/client';
import { SomenteCargos } from 'src/guards/cargo.decorator';
import { CargoGuard } from 'src/guards/cargo.guard';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CertificadoService } from './certificado.service';
import { CreateCertificadoDto } from './dtos/create-certificado.dto';

@UseGuards(JwtAuthGuard)
@Controller('/certificados')
export class CertificadoController {
    constructor(private readonly certificadoService: CertificadoService) {}

    @UseGuards(CargoGuard)
    @SomenteCargos(CargoPosicao.COORDENADOR, CargoPosicao.DIRETOR)
    @Get()
    async getCertificados(@Req() req) {
        const usuarioId: string = req.user.id;
        const certificados = await this.certificadoService.getCertificados(
            usuarioId,
        );
        return new DefaultResponseDTO(certificados);
    }

    @Get('/me')
    async getMeusCertificados(@Req() req) {
        const usuarioId: string = req.user.id;
        const certificados = await this.certificadoService.getMeusCertificados(
            usuarioId,
        );
        return new DefaultResponseDTO(certificados);
    }

    @Get('/:id')
    async getCertificado(@Req() req, @Param('id') id: string) {
        const usuarioId: string = req.user.id;
        const certificados = await this.certificadoService.getCertificado(
            usuarioId,
            id,
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

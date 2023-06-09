import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CargoPosicao } from '@prisma/client';
import * as fs from 'fs-extra';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';
import { SomenteCargos } from 'src/guards/cargo.decorator';
import { CargoGuard } from 'src/guards/cargo.guard';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-evento-dto';
import { FindManyEventosDto } from './dto/find-many-eventos.dto';
import { UpdateEventoDTO } from './dto/update-evento-dto';
import { EventoService } from './evento.service';

const uploadsDestination: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'public',
    'images',
);

@Controller('/eventos')
export class EventoController {
    constructor(private readonly eventService: EventoService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: uploadsDestination,
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(
                        null,
                        `${randomName}${extname(file.originalname.trim())}`,
                    );
                },
            }),
        }),
    )
    async postEvent(
        @Req() req,
        @Body() createEventDto: CreateEventDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        try {
            const usuarioId: string = req.user.id;
            const eventCreate = await this.eventService.createEvent(
                createEventDto,
                usuarioId,
                file?.filename,
            );
            return new DefaultResponseDTO(
                eventCreate,
                'Evento criado com sucesso',
            );
        } catch (error) {
            if (file) {
                await fs.remove(file.path);
            }
            throw error;
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findMany(@Query() filtros: FindManyEventosDto) {
        const events = await this.eventService.findMany(filtros);
        return new DefaultResponseDTO(events, 'Eventos retornados com sucesso');
    }

    @UseGuards(JwtAuthGuard, CargoGuard)
    @SomenteCargos(CargoPosicao.COORDENADOR, CargoPosicao.DIRETOR)
    @Get('/dashboard')
    @HttpCode(HttpStatus.OK)
    async findManyDashboard(@Req() req, @Query() filtros: FindManyEventosDto) {
        const usuarioId = req.user.id;
        const events = await this.eventService.findManyDashboard(
            filtros,
            usuarioId,
        );
        return new DefaultResponseDTO(events, 'Eventos retornados com sucesso');
    }

    @UseGuards(JwtAuthGuard)
    @Get('/inscritos')
    @HttpCode(HttpStatus.OK)
    async findEventosInscritos(@Req() req) {
        const usuarioId = req.user.id;
        const eventos = await this.eventService.findEventosInscritos(usuarioId);
        return new DefaultResponseDTO(eventos, 'Evento retornado com sucesso');
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async findUnique(
        @Param('id') id: string,
        @Query('usuarioId') usuarioId?: string,
    ) {
        const events = await this.eventService.findUnique(id, usuarioId);
        return new DefaultResponseDTO(events, 'Evento retornado com sucesso');
    }

    @UseGuards(JwtAuthGuard, CargoGuard)
    @SomenteCargos(CargoPosicao.COORDENADOR, CargoPosicao.DIRETOR)
    @Post('/gerar-codigo/:id')
    @HttpCode(HttpStatus.OK)
    async gerarCodigoEvento(@Param('id') id: string) {
        const event = await this.eventService.gerarCodigoEvento(id);
        return new DefaultResponseDTO(event, 'Evento atualizado com sucesso');
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: uploadsDestination,
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(
                        null,
                        `${randomName}${extname(file.originalname.trim())}`,
                    );
                },
            }),
        }),
    )
    @HttpCode(HttpStatus.OK)
    async updateEvent(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() data: UpdateEventoDTO,
    ) {
        try {
            const event = await this.eventService.updateEvent(
                id,
                data,
                file?.filename,
            );
            return new DefaultResponseDTO(
                event,
                'Evento atualizado com sucesso',
            );
        } catch (error) {
            if (file) {
                await fs.remove(file.path);
            }
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteEvent(@Param('id') id: string) {
        await this.eventService.deleteEvent(id);
        return new DefaultResponseDTO({}, 'Evento excluído com sucesso');
    }
}

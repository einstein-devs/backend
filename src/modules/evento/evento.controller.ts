import {
    Controller,
    Post,
    Get,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { EventoService } from './evento.service';
import { ParamsGetEventoDto } from './dto/params-post-eventos';
import { CreateEventDto } from './dto/create-evento-dto';
import { stringify } from 'querystring';
import { ApiBody } from '@nestjs/swagger';
import { DefaultResponseDTO } from 'src/shared/dto/default-response.dto';
import { UpdateEventoDTO } from './dto/update-evento-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs-extra';
import { extname } from 'path';

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
                file.filename,
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

    //Listagem de eventos
    @Get()
    @HttpCode(HttpStatus.OK)
    async findMany() {
        const events = await this.eventService.findMany();
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

    //Listagem de evento unico
    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async findUnique(@Param('id') id: string) {
        const events = await this.eventService.findUnique(id);
        return new DefaultResponseDTO(events, 'Evento retornado com sucesso');
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async updateEvent(@Param('id') id: string, @Body() data: UpdateEventoDTO) {
        const event = await this.eventService.updateEvent(id, data);
        return new DefaultResponseDTO(event, 'Evento atualizado com sucesso');
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    async deleteEvent(@Param('id') id: string) {
        await this.eventService.deleteEvent(id);
        return new DefaultResponseDTO({}, 'Evento excluído com sucesso');
    }
}

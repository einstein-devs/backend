import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import * as fs from 'fs-extra';
import { join } from 'path';

@Controller()
export class AppController {
    @Get('/imagens/:imagem')
    async getImagem(@Param('imagem') imagem: string, @Res() res) {
        const publicDirectoryPath = join(__dirname, '..', 'public', 'images');
        const imagemPath = join(publicDirectoryPath, imagem);

        if (!fs.existsSync(imagemPath)) {
            throw new NotFoundException(`Arquivo "${imagem}" não encontrado`);
        }

        return res.sendFile(imagemPath);
    }
}

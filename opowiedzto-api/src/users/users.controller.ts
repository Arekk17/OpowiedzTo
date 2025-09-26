import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pobierz użytkownika po ID' })
  @ApiResponse({
    status: 200,
    description: 'Użytkownik został znaleziony',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Użytkownik nie został znaleziony' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aktualizuj dane użytkownika' })
  @ApiResponse({
    status: 200,
    description: 'Dane użytkownika zostały zaktualizowane',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Użytkownik nie został znaleziony' })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    if (req.user.id !== id) {
      throw new Error('Nie masz uprawnień do edycji tego użytkownika');
    }
    return this.usersService.update(id, updateData);
  }
  @Post('file')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Avatar został dodany',
    type: File,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req,
          file,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSufix = Date.now() + '-' + Math.round(Math.random());
          const ext = extname(file.originalname);
          cb(null, `file-${uniqueSufix}${ext}`);
        },
      }),
      fileFilter: (
        req,
        file,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, false);
      },
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const avatarPath = `/uploads/${file.filename}`;
    await this.usersService.update(user.id, { avatar: avatarPath });

    return {
      message: 'file upload',
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    };
  }
}

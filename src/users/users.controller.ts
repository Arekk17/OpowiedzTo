import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
}

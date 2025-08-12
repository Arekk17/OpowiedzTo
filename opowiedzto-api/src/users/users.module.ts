import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { UserRepository } from './repositories/user.repository';
import { FollowRepository } from './repositories/follow.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  controllers: [UsersController, FollowController],
  providers: [UsersService, FollowService, UserRepository, FollowRepository],
  exports: [UsersService, FollowService, UserRepository, FollowRepository],
})
export class UsersModule {}

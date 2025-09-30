import { Module } from '@nestjs/common';
import { TagRepository } from './repository/tag.repository';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [TagsService, TagRepository],
  exports: [TagsService, TagRepository],
})
export class TagsModule {}

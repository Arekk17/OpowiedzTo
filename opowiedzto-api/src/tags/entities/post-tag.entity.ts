import { Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('post_tags')
@Index('IDX_post_tags_post', ['postId'])
@Index('IDX_post_tags_tag', ['tagId'])
export class PostTag {
  @PrimaryColumn('uuid')
  postId!: string;

  @PrimaryColumn('uuid')
  tagId!: string;
}

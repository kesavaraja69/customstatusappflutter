import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../../authentication/entity/users.entity";
import { PostEntity } from "../../posts/entity/post.entity";
import { FullScreenPostEntity } from "../../post_fullscreen/entity/postfullscreen.entity";

@Entity("comment")
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  comment_id!: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    nullable: false,
  })
  comment_date!: Date;

  @Column({
    nullable: false,
  })
  comment_title!: string;

  //! connection to post fullscreen entity
  @ManyToOne(
    () => FullScreenPostEntity,
    (comment_post_fs) => comment_post_fs.post_fs_comment,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  comment_post_fs!: FullScreenPostEntity;

  //! connection to post entity
  @ManyToOne(() => PostEntity, (comment_post) => comment_post.post_comment, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  comment_post!: PostEntity;

  //! connection to user entity
  @ManyToOne(() => UserEntity, (comment_user) => comment_user.user_comment, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  comment_user!: UserEntity;
}

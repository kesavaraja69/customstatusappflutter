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

@Entity("like")
export class LikeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  like_id!: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    nullable: false,
  })
  like_date!: Date;

  //! connection to post entity
  @ManyToOne(() => PostEntity, (likes_post) => likes_post.post_likes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  likes_post!: PostEntity;

  //! connection to post fullscreen entity
  @ManyToOne(
    () => FullScreenPostEntity,
    (likes_post_fs) => likes_post_fs.post_fs_likes,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  likes_post_fs!: FullScreenPostEntity;

  //! connection to user entity
  @ManyToOne(() => UserEntity, (likes_user) => likes_user.user_likes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  likes_user!: UserEntity;
}

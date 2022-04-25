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

@Entity("share")
export class ShareEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  share_id!: number;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    nullable: false,
  })
  like_date!: Date;

  //! connection to post fullscreen entity
  @ManyToOne(
    () => FullScreenPostEntity,
    (share_post_fs) => share_post_fs.post_fs_share,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  share_post_fs!: FullScreenPostEntity;

  //! connection to post entity
  @ManyToOne(() => PostEntity, (share_post) => share_post.post_share, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  share_post!: PostEntity;

  //! connection to user entity
  @ManyToOne(() => UserEntity, (share_user) => share_user.user_shares, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  share_user!: UserEntity;
}

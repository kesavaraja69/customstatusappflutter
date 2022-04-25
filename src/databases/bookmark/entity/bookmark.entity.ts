import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../authentication/entity/users.entity";
import { PostEntity } from "../../posts/entity/post.entity";
import { FullScreenPostEntity } from "../../post_fullscreen/entity/postfullscreen.entity";

@Entity("bookmark")
export class BookmarkEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  bookmark_id!: number;

  //! connection to post fullscreen entity
  @ManyToOne(
    () => FullScreenPostEntity,
    (bookmark_post_fs) => bookmark_post_fs.post_fs_bookmark,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  bookmark_post_fs!: FullScreenPostEntity;

  //! connection to post entity
  @ManyToOne(() => PostEntity, (bookmark_post) => bookmark_post.post_bookmark, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  bookmark_post!: PostEntity;

  //! connection to user entity
  @ManyToOne(() => UserEntity, (bookmark_user) => bookmark_user.user_bookmark, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  bookmark_user!: UserEntity;
}

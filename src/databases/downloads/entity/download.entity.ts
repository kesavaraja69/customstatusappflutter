import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../authentication/entity/users.entity";
import { PostEntity } from "../../posts/entity/post.entity";
import { FullScreenPostEntity } from "../../post_fullscreen/entity/postfullscreen.entity";

@Entity("download")
export class DownloadEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  download_id!: number;

  //! connection to user
  @ManyToOne(
    () => UserEntity,
    (downloads_user) => downloads_user.user_downloads,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  downloads_user!: UserEntity;

  //! connection to fullscreen Post
  @ManyToOne(
    () => FullScreenPostEntity,
    (download_post_fs) => download_post_fs.post_fs_download,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  download_post_fs!: FullScreenPostEntity;

  
  //! connection to Post
  @ManyToOne(
    () => PostEntity,
    (download_post) => download_post.post_download,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  download_post!: PostEntity;
}

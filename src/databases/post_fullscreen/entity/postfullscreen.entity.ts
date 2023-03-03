import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../authentication/entity/users.entity';
import { BookmarkEntity } from '../../bookmark/entity/bookmark.entity';
import { CategoryEntity } from '../../categorys/entity/category.entity';
import { CommentEntity } from '../../comments/entity/comment.entity';
import { DownloadEntity } from '../../downloads/entity/download.entity';
import { LikeEntity } from '../../likes/entity/likes.entity';
import { ShareEntity } from '../../share/entity/share.entity';
import { SubCategoryEntity } from '../../subcategory/entity/subcategory.entity';
import { ViewsEntity } from '../../views/entity/views.entity';
import { RewardEntity } from '../../rewards/entity/reward.entity';

@Entity('fullscreenpost')
export class FullScreenPostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  fs_post_id!: string;

  @Column({
    nullable: false,
  })
  fs_post_name!: string;

  @Column({
    nullable: false,
  })
  fs_post_description!: string;

  @Column({
    nullable: true,
  })
  fs_post_rewardpoint!: string;

  @Column({
    nullable: false,
  })
  fs_post_videourl!: string;

  @Column({
    nullable: false,
  })
  fs_post_isapproved!: string;

  @Column({
    nullable: false,
  })
  fs_post_imageurl!: string;

  @Column({
    nullable: false,
  })
  fs_post_category!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  fs_post_date!: Date;

  @Column({
    nullable: true,
  })
  fs_post_view!: string;

  //! connection to parentcategory
  @ManyToOne(
    () => SubCategoryEntity,
    (category_post) => category_post.fullScreen_post
  )
  category_post!: SubCategoryEntity;

  //! connection to parentcategory
  @ManyToOne(
    () => CategoryEntity,
    (maincategory_post) => maincategory_post.fullScreen_post
  )
  maincategory_post!: CategoryEntity;

  //! connection to users
  @ManyToOne(() => UserEntity, (upload_user) => upload_user.fullscreenvideo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  upload_user!: UserEntity;

  //! connection to bookmark
  @OneToMany(
    () => BookmarkEntity,
    (post_fs_bookmark) => post_fs_bookmark.bookmark_post_fs
  )
  post_fs_bookmark!: BookmarkEntity[];

  //! connection to download
  @OneToMany(
    () => DownloadEntity,
    (post_fs_download) => post_fs_download.download_post_fs
  )
  @JoinColumn()
  post_fs_download!: DownloadEntity[];

  //! connection to like
  @OneToMany(() => LikeEntity, (post_fs_likes) => post_fs_likes.likes_post_fs)
  @JoinColumn()
  post_fs_likes!: LikeEntity[];

  //! connection to view
  @OneToMany(() => ViewsEntity, (post_fs_views) => post_fs_views.views_post_fs)
  @JoinColumn()
  post_fs_views!: ViewsEntity[];

  //! connection to reward entity
  @OneToMany(
    () => RewardEntity,
    (fs_post_reward) => fs_post_reward.reward_post_fs
  )
  fs_post_reward!: RewardEntity[];

  //! connection to share
  @OneToMany(() => ShareEntity, (post_fs_share) => post_fs_share.share_post_fs)
  @JoinColumn()
  post_fs_share!: ShareEntity[];

  //! connection to comment
  @OneToMany(
    () => CommentEntity,
    (post_fs_comment) => post_fs_comment.comment_post_fs
  )
  @JoinColumn()
  post_fs_comment!: CommentEntity[];
}

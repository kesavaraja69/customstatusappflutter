import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ViewEntity,
} from 'typeorm';
import { UserEntity } from '../../authentication/entity/users.entity';
import { BookmarkEntity } from '../../bookmark/entity/bookmark.entity';
import { CategoryEntity } from '../../categorys/entity/category.entity';
import { CommentEntity } from '../../comments/entity/comment.entity';
import { DownloadEntity } from '../../downloads/entity/download.entity';
import { LikeEntity } from '../../likes/entity/likes.entity';
import { RewardEntity } from '../../rewards/entity/reward.entity';
import { ShareEntity } from '../../share/entity/share.entity';
import { SubCategoryEntity } from '../../subcategory/entity/subcategory.entity';
import { ViewsEntity } from '../../views/entity/views.entity';

@Entity('post')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  post_id!: string;

  @Column({
    nullable: false,
  })
  post_name!: string;

  @Column({
    nullable: false,
  })
  post_description!: string;

  @Column({
    nullable: false,
  })
  post_category!: string;

  @Column({
    nullable: true,
  })
  post_rewardpoint!: string;

  @Column({
    nullable: true,
  })
  post_adloaded!: string;

  @Column({
    nullable: false,
  })
  post_isapproved!: string;

  @Column({
    nullable: true,
  })
  post_view!: string;

  @Column({
    nullable: true,
  })
  post_video_url!: string;

  @Column({
    nullable: true,
  })
  post_yt_video_url!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  post_isvideo!: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  post_isvideo_portrait!: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  post_isyoutubevideo!: boolean;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  post_images!: string[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  post_date!: Date;

  //! connection to parentcategory
  @ManyToOne(
    () => SubCategoryEntity,
    (subcategoryposts) => subcategoryposts.posts
  )
  subcategoryposts!: SubCategoryEntity;

  //! connection to maincategory
  @ManyToOne(
    () => CategoryEntity,
    (maincategoryposts) => maincategoryposts.posts
  )
  maincategoryposts!: CategoryEntity;

  //! connection to like entity
  @OneToMany(() => LikeEntity, (post_likes) => post_likes.likes_post)
  @JoinColumn()
  post_likes!: LikeEntity[];

  //! connection to view entity
  @OneToMany(() => ViewsEntity, (post_views) => post_views.view_post)
  @JoinColumn()
  post_views!: ViewsEntity[];

  //! connection to reward entity
  @OneToMany(() => RewardEntity, (post_reward) => post_reward.reward_post)
  post_reward!: RewardEntity[];

  //! connection to users
  @ManyToOne(() => UserEntity, (upload_user) => upload_user.post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  upload_user!: UserEntity;

  //! connection to share
  @OneToMany(() => ShareEntity, (post_share) => post_share.share_post)
  @JoinColumn()
  post_share!: ShareEntity[];

  //! connection to download
  @OneToMany(
    () => DownloadEntity,
    (post_download) => post_download.download_post
  )
  @JoinColumn()
  post_download!: DownloadEntity[];

  //! connection to bookmark
  @OneToMany(
    () => BookmarkEntity,
    (post_bookmark) => post_bookmark.bookmark_post
  )
  @JoinColumn()
  post_bookmark!: BookmarkEntity[];

  //! connection to comment
  @OneToMany(() => CommentEntity, (post_comment) => post_comment.comment_post)
  @JoinColumn()
  post_comment!: CommentEntity[];
}

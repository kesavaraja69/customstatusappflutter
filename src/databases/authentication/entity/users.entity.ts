import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BookmarkEntity } from "../../bookmark/entity/bookmark.entity";
import { CommentEntity } from "../../comments/entity/comment.entity";
import { ConnectionEntity } from "../../connetcions/entity/connections.entity";
import { ContactusEntity } from "../../contactus/enitiy/contactus.entity";
import { DownloadEntity } from "../../downloads/entity/download.entity";
import { LikeEntity } from "../../likes/entity/likes.entity";
import { PostEntity } from "../../posts/entity/post.entity";
import { FullScreenPostEntity } from "../../post_fullscreen/entity/postfullscreen.entity";
import { ReportsEntity } from "../../reports/entity/reports.entity";
import { AmountEntity } from "../../rewards/entity/amount.entity";
import { RewardEntity } from "../../rewards/entity/reward.entity";
import { ShareEntity } from "../../share/entity/share.entity";
import { UserInfoEntity } from "../../usersinfo/entity/user.infoentity";
import { ViewsEntity } from "../../views/entity/views.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({
    nullable: false,
  })
  useremail!: string;

  @Column({
    nullable: false,
  })
  username!: string;

  @Column({
    nullable: true,
  })
  user_upi_id!: string;

  @Column({
    nullable: false,
  })
  reward_user_level!: string;

  @Column({
    nullable: false,
  })
  reward_All_points!: string;

  @Column({
    nullable: false,
  })
  reward_today_points!: string;

  @Column({
    nullable: false,
    type: "bool",
  })
  is_completed_todaytask!: boolean;

  @Column({
    nullable: true,
    type: "date",
  })
  todaytask_date!: Date;

  @Column({
    nullable: false,
  })
  reward_total_amount!: string;

  @Column({
    nullable: false,
  })
  userpassword!: string;

  @OneToOne(() => UserInfoEntity, (info) => info.user)
  info!: UserInfoEntity;

  @OneToMany(
    () => FullScreenPostEntity,
    (fullscreenvideo) => fullscreenvideo.upload_user
  )
  @JoinColumn()
  fullscreenvideo!: FullScreenPostEntity[];

  @OneToMany(
    () => ContactusEntity,
    (contactus) => contactus.log_user
  )
  @JoinColumn()
  contactus!: ContactusEntity[];

  @OneToMany(
    () => ReportsEntity,
    (reports) => reports.log_user
  )
  @JoinColumn()
  reports!: ReportsEntity[];

  @OneToMany(() => PostEntity, (post) => post.upload_user)
  @JoinColumn()
  post!: PostEntity[];

  //! connection single from (other) user to other many users
  @OneToMany(
    () => ConnectionEntity,
    (from_userconnection_data) =>
      from_userconnection_data.from_userconnected_data,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  from_userconnection_data!: ConnectionEntity[];

  //! connection single to (logged user) to other many users
  @OneToMany(
    () => ConnectionEntity,
    (to_userconnection_data) => to_userconnection_data.to_userconnected_data,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  to_userconnection_data!: ConnectionEntity[];

  //! connect to like entity
  @OneToMany(() => LikeEntity, (user_likes) => user_likes.likes_user)
  @JoinColumn()
  user_likes!: LikeEntity[];

  //! connect to view entity
  @OneToMany(() => ViewsEntity, (user_views) => user_views.views_user)
  @JoinColumn()
  user_views!: ViewsEntity[];

  //! connect to share entity
  @OneToMany(() => ShareEntity, (user_shares) => user_shares.share_user)
  @JoinColumn()
  user_shares!: ShareEntity[];

  //! connect to download
  @OneToMany(
    () => DownloadEntity,
    (user_downloads) => user_downloads.downloads_user
  )
  @JoinColumn()
  user_downloads!: DownloadEntity[];

  //! connect to bookmark
  @OneToMany(
    () => BookmarkEntity,
    (user_bookmark) => user_bookmark.bookmark_user
  )
  @JoinColumn()
  user_bookmark!: BookmarkEntity[];

  //! connect to comment entity
  @OneToMany(() => CommentEntity, (user_comment) => user_comment.comment_user)
  @JoinColumn()
  user_comment!: CommentEntity[];

  //! connect to reward entity
  @OneToMany(() => RewardEntity, (user_reward) => user_reward.reward_user)
  @JoinColumn()
  user_reward!: RewardEntity[];

  //! connect to amount entity
  @OneToMany(() => AmountEntity, (user_amount) => user_amount.amount_user)
  @JoinColumn()
  user_amount!: AmountEntity[];
}

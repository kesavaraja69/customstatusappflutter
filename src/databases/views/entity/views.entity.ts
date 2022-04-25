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
  
  @Entity("view")
  export class ViewsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    view_id!: number;
  
    @Column({
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP(6)",
      nullable: false,
    })
    view_date!: Date;
  
    //! connection to post entity
    @ManyToOne(() => PostEntity, (view_post) => view_post.post_views, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
    view_post!: PostEntity;
  
    //! connection to post fullscreen entity
    @ManyToOne(
      () => FullScreenPostEntity,
      (views_post_fs) => views_post_fs.post_fs_views,
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    )
    views_post_fs!: FullScreenPostEntity;
  
    //! connection to user entity
    @ManyToOne(() => UserEntity, (views_user) => views_user.user_views, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
    views_user!: UserEntity;
  }
  
import { BaseEntity, Column, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from "typeorm/decorator/entity/Entity";
import { CategoryEntity } from "../../categorys/entity/category.entity";
import { PostEntity } from "../../posts/entity/post.entity";
import { FullScreenPostEntity } from "../../post_fullscreen/entity/postfullscreen.entity";

@Entity("subcategory")
export class SubCategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  sub_category_id!: string;

  @Column({ nullable: false })
  sub_category_name!: string;

  //! connection to parentcategory
  @ManyToOne(
    () => CategoryEntity,
    (parent_catergory)=>parent_catergory.sub_category
  )
  parent_catergory!: CategoryEntity;

  //! connection to fullscreenpost
  //! join column to onetomany
  @OneToMany(
    () => FullScreenPostEntity,
    (fullScreen_post) => fullScreen_post.category_post
  )
  @JoinColumn()
  fullScreen_post!: FullScreenPostEntity[];

  // //! connection to post
  @OneToMany(() => PostEntity, (posts) => posts.subcategoryposts)
  @JoinColumn()
  posts!: PostEntity[];
}

import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostEntity } from "../../posts/entity/post.entity";
import { FullScreenPostEntity } from "../../post_fullscreen/entity/postfullscreen.entity";
import { SubCategoryEntity } from "../../subcategory/entity/subcategory.entity";

@Entity("category")
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  category_id!: string;

  @Column({
    nullable: false,
  })
  category_name!: string;

  @Column({
    nullable: false,
  })
  category_image!: string;

  //!  connection to sub catergory
  @OneToMany(
    () => SubCategoryEntity,
    (sub_category) => sub_category.parent_catergory
  )
  @JoinColumn()
  sub_category!: SubCategoryEntity[];

  //! connection to fullscreenpost
  //! join column to onetomany
  @OneToMany(
    () => FullScreenPostEntity,
    (fullScreen_post) => fullScreen_post.maincategory_post
  )
  @JoinColumn()
  fullScreen_post!: FullScreenPostEntity[];

  // //! connection to post
  @OneToMany(() => PostEntity, (posts) => posts.maincategoryposts)
  @JoinColumn()
  posts!: PostEntity[];
}

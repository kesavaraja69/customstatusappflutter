import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
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
    (sub_category)=>sub_category.parent_catergory
  )
  @JoinColumn()
  sub_category!: SubCategoryEntity[];
}

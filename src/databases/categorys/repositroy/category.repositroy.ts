import { EntityRepository, Repository } from "typeorm";
import { CategoryEntity } from "../entity/category.entity";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  async submitCategory(req: Request, res: Response) {
    let admin_token = req.headers.authorization as string;
    let base_admin_sceret_kry = process.env.ADMIN_SCRECT_PASSWORD;

    if (admin_token === base_admin_sceret_kry) {
      let { category_name, category_image, category_type } = req.body;

      await this.createQueryBuilder("category")
        .insert()
        .values({
          category_name,
          category_image,
        })
        .execute()
        .then((data: any) => {
          if (data) {
            res.send({
              code: 201,
              message: "category added under database",
              submitted: true,
            });
          }
        })
        .catch((error: any) => {
          if (error) {
            res.send({
              code: 402,
              message: "something went wrong ,try again",
              submitted: false,
            });
          }
        });
    } else {
      res.send({
        code: 403,
        message: "please enter valid admin code",
        submitted: false,
      });
    }
  }
  //! fetch all categoty only
  async fetchCategory(req: Request, res: Response) {
    try {
      let categorys = await this.createQueryBuilder("category")
        .select()
        .getMany();

      if (categorys !== undefined) {
        res.send({
          code: 201,
          message: categorys,
          received: true,
        });
      } else {
        res.send({
          code: 403,
          message: "not category found",
          received: false,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          message: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  //! fetch all categotywithposts only
  async fetchallCategorys(req: Request, res: Response) {
    try {
      let { parent_category_id } = req.params;
      let categorys = await this.createQueryBuilder("category")
        .leftJoinAndSelect("category.sub_category", "subcategory")
        .leftJoinAndSelect("subcategory.fullScreen_post", "fullscreenpost")
        .leftJoinAndSelect("subcategory.posts", "post")
        .leftJoinAndSelect("post.upload_user", "users")
        .andWhere("category.category_id = :parent_category_id", {
          parent_category_id,
        })
        .select()
        .getMany();

      if (categorys !== undefined) {
        res.send({
          code: 201,
          data: categorys,
          received: true,
        });
      } else {
        res.send({
          code: 403,
          data: "not category found",
          received: false,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: "something went wrong,try again",
          received: false,
        });
      }
    }
  }
}

import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { SubCategoryEntity } from "../entity/subcategory.entity";
import { CategoryRepository } from "../../categorys/repositroy/category.repositroy";
dotenv.config();
@EntityRepository(SubCategoryEntity)
export class SubCategoryRepository extends Repository<SubCategoryEntity> {
  async submitSubCategory(req: Request, res: Response) {
    let admin_token = req.headers.authorization as string;
    let base_admin_sceret_kry = process.env.ADMIN_SCRECT_PASSWORD;

    if (admin_token === base_admin_sceret_kry) {
      let { sub_category_name } = req.body;

      let { category_id } = req.params;

      let categoryRepository = getCustomRepository(CategoryRepository);

      let parent_category_id = await categoryRepository.findOne({
        category_id,
      });
      let subcategoryentity = new SubCategoryEntity();

      subcategoryentity.sub_category_name = sub_category_name;
      subcategoryentity.parent_catergory = parent_category_id!;

      await subcategoryentity
        .save()
        .then((data: any) => {
          if (data) {
            res.send({
              code: 201,
              message: "subcategory added under database",
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

  //! fetch all subcategoty
  async fetchsubCategory(req: Request, res: Response) {
    try {
      let subcategorys = await this.createQueryBuilder("subcategory")
        .select()
        .getMany();

      if (subcategorys !== undefined) {
        res.send({
          code: 201,
          message: subcategorys,
          received: true,
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

  //! fetch all
  async fetchallsubCategory(req: Request, res: Response) {
    try {
      let { parent_category_id } = req.params;
      let categorys = await this.createQueryBuilder("subcategory")
        .leftJoinAndSelect("subcategory.parent_catergory", "category")
        .leftJoinAndSelect("subcategory.fullScreen_post", "fullscreenpost")
        .leftJoinAndSelect("subcategory.posts", "post")
        .select()
        .where("category.category_id = :parent_category_id", {
          parent_category_id,
        })
        .getMany();

      if (categorys !== undefined) {
        res.send({
          code: 201,
          message: categorys,
          received: true,
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
}

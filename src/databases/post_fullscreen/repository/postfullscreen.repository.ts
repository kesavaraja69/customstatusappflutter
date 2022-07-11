import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { FullScreenPostEntity } from "../entity/postfullscreen.entity";
import { SubCategoryRepository } from "../../subcategory/repository/subcategory.repository";
import { UserRepository } from "../../authentication/repository/users.repositroy";
import { CategoryRepository } from "../../categorys/repositroy/category.repositroy";
dotenv.config();
@EntityRepository(FullScreenPostEntity)
export class FullScreenPostRepository extends Repository<FullScreenPostEntity> {
  async submitFullScreenPost(req: Request, res: Response) {
    let admin_token = req.headers.authorization;
    let base_admin_sceret_kry = process.env.ADMIN_SCRECT_PASSWORD;

    let { category_id } = req.params;
    let {
      fs_post_name,
      fs_post_description,
      fs_post_videourl,
      fs_post_imageurl,
      fs_post_category,
      useremail,
    } = req.body;

    let maincategoryRepository = getCustomRepository(CategoryRepository);
    let parentsub_category_id = await maincategoryRepository.findOne({
      category_id: category_id,
    });
    let userRepository = getCustomRepository(UserRepository);
    let user = await userRepository.findOne({ useremail });

    let fullscreenentity = new FullScreenPostEntity();

    if (user !== undefined) {
      fullscreenentity.upload_user = user;
      if (admin_token === base_admin_sceret_kry) {
        fullscreenentity.fs_post_isapproved = "true";
      } else {
        fullscreenentity.fs_post_isapproved = "false";
      }
      fullscreenentity.fs_post_name = fs_post_name;
      fullscreenentity.fs_post_description = fs_post_description;
      fullscreenentity.fs_post_videourl = fs_post_videourl;
      fullscreenentity.fs_post_imageurl = fs_post_imageurl;
      fullscreenentity.fs_post_category = fs_post_category;
      fullscreenentity.fs_post_view = "0";
      fullscreenentity.maincategory_post = parentsub_category_id!;

      await fullscreenentity
        .save()
        .then((data: any) => {
          if (data) {
            res.send({
              code: 201,
              message: "fullscreen video added under database",
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
        message: "user not found",
        submitted: false,
      });
    }
  }
  async fetchFullScreenPostDetailPage(req: Request, res: Response) {
    let { detail_id } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .select()
        .where("fullscreenpost.fs_post_id = :detail_id", { detail_id })
        .getOne();

      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          recivied: true,
        });
      } else {
        res.send({
          code: 301,
          data: null,
          recivied: false,
        });
      }
    } catch (error) {
      res.send({
        code: 303,
        data: "something went wrong",
        recivied: false,
      });
    }
  }

  //! fetch fullscreenpost with limit 
  async fetchFullScreenPostwithlimit(req: Request, res: Response) {
   let { count} = req.params;
    const dataindex: any = count;
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
      .leftJoinAndSelect("fullscreenpost.upload_user", "users")
      .leftJoinAndSelect("users.info", "usersinfo")
      .take(dataindex)
      .select([
        "fullscreenpost",
        "users.id",
        "users.useremail",
        "users.username",
        "usersinfo.info_id",
        "usersinfo.profileimage",
      ])
      .getMany();

      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          recivied: true,
        });
      } else {
        res.send({
          code: 302,
          data: null,
          recivied: false,
        });
      }
    } catch (error) {
      res.send({
        code: 303,
        data: "something went wrong",
        recivied: false,
      });
    }
  }

  async fetchFullScreenPost(req: Request, res: Response) {
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      }else{
        res.send({
          code: 302,
          data: null,
          received: true,
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

  async fetchFullScreenPostbycategoryid(req: Request, res: Response) {
    let { parent_category_id } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
      .leftJoinAndSelect("fullscreenpost.category_post", "subcategory")
      .leftJoinAndSelect("subcategory.parent_catergory", "category")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .andWhere("category.category_id = :parent_category_id", {
          parent_category_id,
        })
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      }else{
        res.send({
          code: 302,
          data: null,
          received: true,
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

  async fetchFullScreenPostbyuser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .where("users.useremail = :useremail", { useremail })
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      }else{
        res.send({
          code: 302,
          data: null,
          received: true,
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

  async fetchallFullScreenPost(req: Request, res: Response) {
    try {
      let { sub_category_id, parent_category_id } = req.params;
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.category_post", "subcategory")
        .leftJoinAndSelect("subcategory.parent_catergory", "category")
        .select()
        .where("subcategory.sub_category_id = :sub_category_id", {
          sub_category_id,
        })
        .andWhere("category.category_id = :parent_category_id", {
          parent_category_id,
        })
        .getMany();

      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
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

  //! fetch fullscreenstatus comments
  async fetchComment(req: Request, res: Response) {
    let { fs_post_id } = req.params;
    try {
      let response = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.post_fs_comment", "comment")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select()
        .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .getMany();
      let data1 = response.length > 0;
      if (!data1) {
        return res.send({
          code: 204,
          message: "data is empty",
          data: null,
        });
      } else {
        return res.send({
          code: 201,
          message: "data avalaible",
          data: response,
        });
      }
    } catch (error) {
      if (error) {
        return res.send({
          code: 401,
          message: "something went wrong",
          data: null,
        });
      }
    }
  }

  async isapprovedfullscreenpost(req: Request, res: Response) {
    let { fs_post_isapproved, fs_post_id } = req.body;

    let admin_token = req.headers.authorization;
    let base_admin_sceret_kry = process.env.ADMIN_SCRECT_PASSWORD;

    if (admin_token === base_admin_sceret_kry) {
      await this.createQueryBuilder()
        .update(FullScreenPostEntity)
        .set({
          fs_post_isapproved,
        })
        .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .execute()
        .then((data: any) => {
          var isAffected = data.affected;

          if (isAffected > 0) {
            return res.send({
              code: 201,
              message: "updated Sucessfully",
              submitted: true,
            });
          } else {
            return res.send({
              code: 301,
              message: "not updated user not found",
              submitted: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.send({
            code: 401,
            message: "something went wrong",
            submitted: false,
          });
        });
    } else {
      return res.send({
        code: 303,
        message: "your not admin",
        submitted: false,
      });
    }
  }

  async addviewfullscreenpost(req: Request, res: Response) {
    let { fs_post_view, fs_post_id } = req.body;

    await this.createQueryBuilder()
      .update(FullScreenPostEntity)
      .set({
        fs_post_view,
      })
      .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
      .execute()
      .then((data: any) => {
        var isAffected = data.affected;

        if (isAffected > 0) {
          return res.send({
            code: 201,
            message: "updated Sucessfully",
            submitted: true,
          });
        } else {
          return res.send({
            code: 301,
            message: "not updated user not found",
            submitted: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.send({
          code: 401,
          message: "something went wrong",
          submitted: false,
        });
      });
  }
}

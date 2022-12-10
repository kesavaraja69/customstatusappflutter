import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { PostEntity } from "../entity/post.entity";
import { SubCategoryRepository } from "../../subcategory/repository/subcategory.repository";
import { UserRepository } from "../../authentication/repository/users.repositroy";
import { CategoryRepository } from "../../categorys/repositroy/category.repositroy";

dotenv.config();
@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async submitPost(req: Request, res: Response) {
    let admin_token = req.headers.authorization as string;
    let base_admin_sceret_kry = process.env.ADMIN_SCRECT_PASSWORD;

    let { category_id } = req.params;
    let {
      post_name,
      post_description,
      post_category,
      post_isVideo,
      post_images,
      useremail,
      post_video_url,
      post_yt_video_url,
      post_isyoutubevideo,
      post_isvideo_portrait,
    } = req.body;

    let maincategoryRepository = getCustomRepository(CategoryRepository);
    let parentsub_category_id = await maincategoryRepository.findOne({
      category_id: category_id,
    });
    let userRepository = getCustomRepository(UserRepository);
    let user = await userRepository.findOne({ useremail });

    if (user != undefined) {
      let postentity = new PostEntity();
      postentity.upload_user = user!;
      postentity.post_name = post_name;
      if (admin_token === base_admin_sceret_kry) {
        postentity.post_isapproved = "true";
      } else {
        postentity.post_isapproved = "false";
      }
      postentity.post_description = post_description;
      postentity.post_category = post_category;
      postentity.post_images = post_images;
      postentity.post_isvideo = post_isVideo;
      postentity.post_video_url = post_video_url;
      postentity.post_yt_video_url = post_yt_video_url;
      postentity.post_isvideo_portrait = post_isvideo_portrait;
      postentity.post_isyoutubevideo = post_isyoutubevideo;
      postentity.post_view = "0";
      postentity.maincategoryposts = parentsub_category_id!;
      await postentity
        .save()
        .then((data: any) => {
          if (data) {
            res.send({
              code: 201,
              message: "post added under database",
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
        code: 303,
        message: "user not found",
        submitted: false,
      });
    }
  }

  async fetchPost(req: Request, res: Response) {
    try {
      let post = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "post",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
          "usersinfo.customimage",
        ])
        .getMany();

      if (post !== undefined) {
        res.send({
          code: 201,
          data: post,
          message: "Fetched Sucessfully",
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: null,
          message: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  async fetchdownloadsPostbyuser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.post_download", "download")
        .leftJoin("download.downloads_user", "users")
        .select([
          "post",
          "download.download_id"
        ])
        .andWhere("users.useremail = :useremail", { useremail })
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      } else {
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

  async fetchpostuserBookmark(req: Request, res: Response) {
    try {
      let { useremail } = req.params;

      var response = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.post_bookmark", "bookmark")
        .leftJoinAndSelect("bookmark.bookmark_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "post",
          "bookmark.bookmark_id",
        ])
        .where("users.useremail = :useremail", { useremail })
        .getMany();
      if (response !== undefined) {
        return res.send({
          code: 201,
          data: response,
        });
      } else {
        return res.send({
          code: 301,
          data: "no data available",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchpostuploaduserprofile(req: Request, res: Response) {
    try {
      let { post_id } = req.params;

      var response = await this.createQueryBuilder("post")
        .leftJoin("post.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "post",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
          "usersinfo.customimage",
        ])
        .where("post.post_id = :post_id", { post_id })
        .getOne();
      if (response !== undefined) {
        return res.send({
          code: 201,
          data: response,
        });
      } else {
        return res.send({
          code: 301,
          data: "no data available",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchPostbycateroyid(req: Request, res: Response) {
    let { parent_category_id } = req.params;
    try {
      let post = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.maincategoryposts", "category")
        .leftJoinAndSelect("post.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "post",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
          "usersinfo.customimage",
        ])
        .andWhere("category.category_id = :parent_category_id", {
          parent_category_id,
        })
        .getMany();

      if (post !== undefined) {
        res.send({
          code: 201,
          data: post,
          message: "Fetched Sucessfully",
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: null,
          message: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  async fetchPostrandomly(req: Request, res: Response) {
    try {
      let post = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        // .from(PostEntity,"post")
        .select([
          "post",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
          "usersinfo.customimage",
        ])
        .orderBy("RANDOM()")
        .limit(4)
        .getMany();

      if (post !== undefined) {
        res.send({
          code: 201,
          data: post,
          message: "Fetched Sucessfully",
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: null,
          message: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  async fetchpostdetail(req: Request, res: Response) {
    let { post_id } = req.params;
    try {
      let postdetail = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "post",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
          "usersinfo.customimage",
        ])
        .where("post.post_id = :post_id", { post_id })
        .getOne();
      if (postdetail !== undefined) {
        res.send({
          code: 201,
          data: postdetail,
          message: "recivied",
        });
      } else {
        res.send({
          code: 302,
          data: null,
          message: "not recivied",
        });
      }
    } catch (error) {
      res.send({
        code: 403,
        data: null,
        message: "something went wrong",
      });
    }
  }

  async fetchallPostbyuser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let post = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "post",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
          "usersinfo.customimage",
        ])
        .where("users.useremail = :useremail", { useremail })
        .getMany();

      if (post !== undefined) {
        res.send({
          code: 201,
          data: post,
          message: "Fetched Sucessfully",
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: null,
          message: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  //! fetch post comments
  async fetchCommentpost(req: Request, res: Response) {
    let { post_id } = req.params;
    try {
      let response = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.post_comment", "comment")
        .leftJoinAndSelect("post.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "post",
          "users.id",
          "comment",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
          "usersinfo.customimage",
        ])
        .where("post.post_id = :post_id", { post_id })
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

   //! approved all posts
   async fetchFullPostappall(req: Request, res: Response) {
    let { isapproved } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "post",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
          "usersinfo.customimage",
        ])
        .where("post.post_isapproved = :post_isapproved", {
          post_isapproved: isapproved,
        })
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          message :"data is available",
          received: true,
        });
      } else {
        res.send({
          code: 302,
          data: null,
          message :"data not found",
          received: false,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: null,
          message :"something went wrong,try again",
          received: false,
        });
      }
    }
  }

  async isapprovedpost(req: Request, res: Response) {
    let { post_isapproved, post_id } = req.body;
    let admin_token = req.headers.authorization;
    let base_admin_sceret_kry = process.env.ADMIN_SCRECT_PASSWORD;

    if (admin_token === base_admin_sceret_kry) {
      await this.createQueryBuilder()
        .update(PostEntity)
        .set({
          post_isapproved,
        })
        .where("post.post_id = :post_id", { post_id })
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

  async addviewpost(req: Request, res: Response) {
    let { post_view, post_id } = req.body;

    await this.createQueryBuilder()
      .update(PostEntity)
      .set({
        post_view,
      })
      .where("post.post_id = :post_id", { post_id })
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
            message: "not updated",
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

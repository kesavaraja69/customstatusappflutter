import {
  EntityRepository,
  getCustomRepository,
  Index,
  Repository,
} from "typeorm";
import { Request, Response } from "express";
import { LikeEntity } from "../entity/likes.entity";
import { UserRepository } from "../../authentication/repository/users.repositroy";
import { FullScreenPostRepository } from "../../post_fullscreen/repository/postfullscreen.repository";
import { PostRepository } from "../../posts/repository/post.repository";

@EntityRepository(LikeEntity)
export class LikeRepositiory extends Repository<LikeEntity> {
  //! fullscreenpost
  async addLikes(req: Request, res: Response) {
    let { useremail, fs_post_id } = req.body;

    var isAlreadyLiked =
      (await this.createQueryBuilder("like")
        .leftJoin("like.likes_post_fs", "fullscreenpost")
        .leftJoin("like.likes_user", "users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .andWhere("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .getCount()) > 0;

    if (isAlreadyLiked) {
      return res.send({
        code: 403,
        data: "User is Already Liked",
        added: false,
      });
    }

    if (!isAlreadyLiked) {
      let userRepositiory = getCustomRepository(UserRepository);
      let user = await userRepositiory.findOne({ useremail });

      let postRepositiory = getCustomRepository(FullScreenPostRepository);
      let postfs = await postRepositiory.findOne({ fs_post_id });

      let likeEntity = new LikeEntity();

      likeEntity.likes_post_fs = postfs!;
      likeEntity.likes_user = user!;

      await likeEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "User is Liked",
              added: true,
            });
          }
        })
        .catch((error: any) => {
          if (error) {
            return res.send({
              code: 402,
              data: "something went wrong",
              added: false,
            });
          }
        });
    }
  }

  async checkuserLike(req: Request, res: Response) {
    try {
      let { useremail, fs_post_id } = req.params;

      var isAlreadyLiked =
        (await this.createQueryBuilder("like")
          .leftJoin("like.likes_post_fs", "fullscreenpost")
          .leftJoin("like.likes_user", "users")
          .select("like.like_id")
          .where("users.useremail = :useremail", { useremail })
          .andWhere("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
          .getCount()) > 0;

      if (isAlreadyLiked) {
        var islikeduser = await this.createQueryBuilder("like")
          .leftJoin("like.likes_post_fs", "fullscreenpost")
          .leftJoin("like.likes_user", "users")
          .select("like.like_id")
          .where("users.useremail = :useremail", { useremail })
          .andWhere("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
          .getOne();

        res.send({
          code: 201,
          data: "User is liked ",
          message: islikeduser,
          isliked: true,
        });
      } else {
        return res.send({
          code: 301,
          data: "User is not Liked",
          isliked: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchLikes(req: Request, res: Response) {
    try {
      let { fs_post_id } = req.params;
      let response = await this.createQueryBuilder("like")
        .leftJoin("like.likes_post_fs", "fullscreenpost")
        .leftJoin("like.likes_user", "users")
        .select()
        .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .getMany();

      let data1 = response.length > 0;
      if (!data1) {
        return res.send({
          code: 204,
          recivied: false,
          data: "data is empty",
        });
      } else {
        return res.send({
          code: 201,
          recivied: true,
          data: response,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  //! post
  async addLikespost(req: Request, res: Response) {
    let { useremail, post_id } = req.body;

    var isAlreadyLiked =
      (await this.createQueryBuilder("like")
        .leftJoin("like.likes_post", "post")
        .leftJoin("like.likes_user", "users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .andWhere("post.post_id = :post_id", { post_id })
        .getCount()) > 0;

    if (isAlreadyLiked) {
      return res.send({
        code: 403,
        data: "User is Already Liked",
        added: false,
      });
    }

    if (!isAlreadyLiked) {
      let userRepositiory = getCustomRepository(UserRepository);
      let user = await userRepositiory.findOne({ useremail });

      let postRepositiory = getCustomRepository(PostRepository);
      let postfs = await postRepositiory.findOne({ post_id });

      let likeEntity = new LikeEntity();

      likeEntity.likes_post = postfs!;
      likeEntity.likes_user = user!;

      await likeEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "User is Liked",
              added: true,
            });
          }
        })
        .catch((error: any) => {
          if (error) {
            return res.send({
              code: 402,
              data: "something went wrong",
              added: false,
            });
          }
        });
    }
  }

  async checkuserLikepost(req: Request, res: Response) {
    try {
      let { useremail, post_id } = req.params;

      var isAlreadyLiked =
        (await this.createQueryBuilder("like")
          .leftJoin("like.likes_post", "post")
          .leftJoin("like.likes_user", "users")
          .select("like.like_id")
          .where("users.useremail = :useremail", { useremail })
          .andWhere("post.post_id = :post_id", { post_id })
          .getCount()) > 0;

      if (isAlreadyLiked) {
        var islikeduser = await this.createQueryBuilder("like")
          .leftJoin("like.likes_post", "post")
          .leftJoin("like.likes_user", "users")
          .select("like.like_id")
          .where("users.useremail = :useremail", { useremail })
          .andWhere("post.post_id = :post_id", { post_id })
          .getOne();

        res.send({
          code: 201,
          data: "User is liked ",
          message: islikeduser,
          isliked: true,
        });
      } else {
        return res.send({
          code: 301,
          data: "User is not Liked",
          isliked: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchLikespost(req: Request, res: Response) {
    try {
      let { post_id } = req.params;
      let response = await this.createQueryBuilder("like")
        .leftJoin("like.likes_post", "post")
        .leftJoin("like.likes_user", "users")
        .select()
        .where("post.post_id = :post_id", { post_id })
        .getMany();

      let data1 = response.length > 0;
      if (!data1) {
        return res.send({
          code: 204,
          recivied: false,
          data: "data is empty",
        });
      } else {
        return res.send({
          code: 201,
          recivied: true,
          data: response,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async removelike(req: Request, res: Response) {
    try {
      let { like_id } = req.params;
      await this.createQueryBuilder("like")
        .delete()
        .from(LikeEntity)
        .where("like_id = :like_id", { like_id })
        .execute()
        .then((data: any) => {
          let isAffected = data.affected;
          if (isAffected > 0) {
            return res.send({
              code: 201,
              data: "Remove the like",
              removed: true,
            });
          } else {
            return res.send({
              code: 301,
              data: "Like is not removed",
              removed: false,
            });
          }
        })
        .catch((error: any) => {
          if (error !== undefined) {
            console.log(error);
            return res.send({
              code: 403,
              data: "something went wrong",
              removed: false,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
}

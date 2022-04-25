import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { CommentEntity } from "../entity/comment.entity";
import { Request, Response } from "express";
import { UserRepository } from "../../authentication/repository/users.repositroy";
import { FullScreenPostRepository } from "../../post_fullscreen/repository/postfullscreen.repository";
import { PostRepository } from "../../posts/repository/post.repository";
@EntityRepository(CommentEntity)
export class CommentRepositiory extends Repository<CommentEntity> {
  async addComment(req: Request, res: Response) {
    let { useremail, fs_post_id, comment_title } = req.body;

    var isAlreadyLiked =
      (await this.createQueryBuilder("comment")
        .leftJoin("comment.comment_post_fs", "fullscreenpost")
        .leftJoin("comment.comment_user", "users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .andWhere("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .getCount()) > 0;

    if (isAlreadyLiked) {
      return res.send({
        code: 403,
        data: "User is Already commented",
        added: false,
      });
    }

    if (!isAlreadyLiked) {
      let userRepositiory = getCustomRepository(UserRepository);
      let user = await userRepositiory.findOne({ useremail });

      let postRepositiory = getCustomRepository(FullScreenPostRepository);
      let postfs = await postRepositiory.findOne({ fs_post_id });

      let commentEntity = new CommentEntity();

      commentEntity.comment_post_fs = postfs!;
      commentEntity.comment_user = user!;
      commentEntity.comment_title = comment_title;

      await commentEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "User is Commented",
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

  async updateComment(req: Request, res: Response) {
    let { useremail, fs_post_id, comment_title, comment_id } = req.body;

    let userRepositiory = getCustomRepository(UserRepository);
    let user = await userRepositiory.findOne({ useremail });

    let postRepositiory = getCustomRepository(FullScreenPostRepository);
    let postfs = await postRepositiory.findOne({ fs_post_id });

    let commentEntity = new CommentEntity();

    commentEntity.comment_post_fs = postfs!;
    commentEntity.comment_user = user!;
    commentEntity.comment_title = comment_title;

    await this.createQueryBuilder("comment")
      .update(commentEntity)
      .set({
        comment_title,
      })
      .where("comment_id = :comment_id", { comment_id })
      .execute()
      .then((data: any) => {
        if (data !== undefined) {
          return res.send({
            code: 201,
            data: "User is Comment updated",
            added: true,
          });
        } else {
          return res.send({
            code: 301,
            data: "Comment not updated",
            added: false,
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

  async fetchComment(req: Request, res: Response) {
    let { fs_post_id } = req.params;
    try {
      let response = await this.createQueryBuilder("comment")
        .leftJoinAndSelect("comment.comment_post_fs", "fullscreenpost")
        .leftJoinAndSelect("comment.comment_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost.fs_post_id",
          "users.id",
          "comment",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .getMany();

      var data1 = response.length > 0;
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

  async fetchCommentbyuser(req: Request, res: Response) {
    let { fs_post_id, useremail } = req.params;
    try {
      let response = await this.createQueryBuilder("comment")
        .leftJoinAndSelect("comment.comment_post_fs", "fullscreenpost")
        .leftJoinAndSelect("comment.comment_user", "users")
        .select([
          "fullscreenpost.fs_post_id",
          "users.id",
          "comment",
          "users.useremail",
          "users.username",
        ])
        .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .andWhere("users.useremail = :useremail", { useremail })
        .getOne();

      if (response == undefined) {
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

  async deletcomment(req: Request, res: Response) {
    let { comment_id } = req.params;
    try {
      await this.createQueryBuilder("comment")
        .delete()
        .from(CommentEntity)
        .where("comment.comment_id = :comment_id", { comment_id })
        .execute()
        .then((data: any) => {
          var isaffected = data.affected;
          if (isaffected > 0) {
            res.send({
              code: 201,
              data: "comment removed",
              removed: true,
            });
          } else {
            res.send({
              code: 301,
              data: "comment not removed",
              removed: false,
            });
          }
        });
    } catch (error) {
      if (error) {
        res.send({
          code: 401,
          data: "something went wrong in comment delete",
          removed: false,
        });
      }
    }
  }

  //! post

  async addCommentpost(req: Request, res: Response) {
    let { useremail, post_id, comment_title } = req.body;

    var isAlreadyLiked =
      (await this.createQueryBuilder("comment")
        .leftJoin("comment.comment_post", "post")
        .leftJoin("comment.comment_user", "users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .andWhere("post.post_id = :post_id", { post_id })
        .getCount()) > 0;

    if (isAlreadyLiked) {
      return res.send({
        code: 403,
        data: "User is Already commented",
        added: false,
      });
    }

    if (!isAlreadyLiked) {
      let userRepositiory = getCustomRepository(UserRepository);
      let user = await userRepositiory.findOne({ useremail });

      let postRepositiory = getCustomRepository(PostRepository);
      let postfs = await postRepositiory.findOne({ post_id });

      let commentEntity = new CommentEntity();

      commentEntity.comment_post = postfs!;
      commentEntity.comment_user = user!;
      commentEntity.comment_title = comment_title;

      await commentEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "User is Commented",
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

  async updateCommentpost(req: Request, res: Response) {
    let { useremail, post_id, comment_title, comment_id } = req.body;

    let userRepositiory = getCustomRepository(UserRepository);
    let user = await userRepositiory.findOne({ useremail });

    let postRepositiory = getCustomRepository(PostRepository);
    let postfs = await postRepositiory.findOne({ post_id });

    let commentEntity = new CommentEntity();

    commentEntity.comment_post = postfs!;
    commentEntity.comment_user = user!;
    commentEntity.comment_title = comment_title;

    await this.createQueryBuilder("comment")
      .update(commentEntity)
      .set({
        comment_title,
      })
      .where("comment_id = :comment_id", { comment_id })
      .execute()
      .then((data: any) => {
        if (data !== undefined) {
          return res.send({
            code: 201,
            data: "User is Comment updated",
            added: true,
          });
        } else {
          return res.send({
            code: 301,
            data: "Comment not updated",
            added: false,
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

  async fetchCommentpost(req: Request, res: Response) {
    let { post_id } = req.params;
    try {
      let response = await this.createQueryBuilder("comment")
        .leftJoinAndSelect("comment.comment_post", "post")
        .leftJoinAndSelect("comment.comment_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "post.post_id",
          "users.id",
          "comment",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .where("post.post_id = :post_id", { post_id })
        .getMany();

      var data1 = response.length > 0;
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

  async fetchCommentbyuserpost(req: Request, res: Response) {
    let { post_id, useremail } = req.params;
    try {
      let response = await this.createQueryBuilder("comment")
        .leftJoinAndSelect("comment.comment_post", "post")
        .leftJoinAndSelect("comment.comment_user", "users")
        .select([
          "post.post_id",
          "users.id",
          "comment",
          "users.useremail",
          "users.username",
        ])
        .where("post.post_id = :post_id", { post_id })
        .andWhere("users.useremail = :useremail", { useremail })
        .getOne();

      if (response == undefined) {
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
}

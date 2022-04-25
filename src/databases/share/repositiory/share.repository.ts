import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Request, Response } from "express";
import { ShareEntity } from "../entity/share.entity";
import { UserRepository } from "../../authentication/repository/users.repositroy";
import { FullScreenPostRepository } from "../../post_fullscreen/repository/postfullscreen.repository";
import { PostRepository } from "../../posts/repository/post.repository";

@EntityRepository(ShareEntity)
export class ShareRepositiory extends Repository<ShareEntity> {
  async addshare(req: Request, res: Response) {
    let { useremail, fs_post_id } = req.body;

    var isAlreadyLiked =
      (await this.createQueryBuilder("share")
        .leftJoin("share.share_post_fs", "fullscreenpost")
        .leftJoin("share.share_user", "users")
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

      let shareEntity = new ShareEntity();

      shareEntity.share_post_fs = postfs!;
      shareEntity.share_user = user!;

      await shareEntity
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

  async fetchshare(req: Request, res: Response) {
    try {
      let { fs_post_id } = req.params;

      let reponse = await this.createQueryBuilder("share")
        .leftJoin("share.share_post_fs", "fullscreenpost")
        .select()
        .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .getMany();

      if (reponse != undefined) {
        res.send({
          code: 201,
          data: reponse,
          message: "recived",
        });
      } else {
        res.send({
          code: 302,
          data: null,
          message: "not found",
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

  //! post
  async addsharepost(req: Request, res: Response) {
    let { useremail, post_id } = req.body;

    var isAlreadyLiked =
      (await this.createQueryBuilder("share")
        .leftJoin("share.share_post", "post")
        .leftJoin("share.share_user", "users")
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

      let shareEntity = new ShareEntity();

      shareEntity.share_post = postfs!;
      shareEntity.share_user = user!;

      await shareEntity
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

  async fetchsharepost(req: Request, res: Response) {
    try {
      let { post_id } = req.params;

      let reponse = await this.createQueryBuilder("share")
        .leftJoin("share.share_post", "post")
        .select()
        .where("post.post_id = :post_id", { post_id })
        .getMany();

      if (reponse != undefined) {
        res.send({
          code: 201,
          data: reponse,
          message: "recived",
        });
      } else {
        res.send({
          code: 302,
          data: null,
          message: "not found",
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
}

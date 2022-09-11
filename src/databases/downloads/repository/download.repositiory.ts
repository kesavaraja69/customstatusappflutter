import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { DownloadEntity } from "../entity/download.entity";
import { Request, Response } from "express";
import { UserRepository } from "../../authentication/repository/users.repositroy";
import { LikeEntity } from "../../likes/entity/likes.entity";
import { FullScreenPostRepository } from "../../post_fullscreen/repository/postfullscreen.repository";
import { PostRepository } from "../../posts/repository/post.repository";

@EntityRepository(DownloadEntity)
export class DownloadRepositiory extends Repository<DownloadEntity> {
  async addDownload(req: Request, res: Response) {
    let { useremail, fs_post_id } = req.body;
    var isAlreadDownloaded =
      (await this.createQueryBuilder("download")
        .leftJoin("download.download_post_fs", "fullscreenpost")
        .leftJoin("download.downloads_user", "users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .andWhere("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .getCount()) > 0;

    if (isAlreadDownloaded) {
      return res.send({
        code: 403,
        data: "User is Already Download",
        added: false,
      });
    }

    if (!isAlreadDownloaded) {
      let userRepositiory = getCustomRepository(UserRepository);
      let user = await userRepositiory.findOne({ useremail });

      let postRepositiory = getCustomRepository(FullScreenPostRepository);
      let postfs = await postRepositiory.findOne({ fs_post_id });

      let downloadEntity = new DownloadEntity();

      downloadEntity.download_post_fs = postfs!;
      downloadEntity.downloads_user = user!;

      await downloadEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "User is Downloaded",
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

  async checkuserDownload(req: Request, res: Response) {
    try {
      let { useremail, fs_post_id } = req.params;

      var isAlreadyLiked =
        (await this.createQueryBuilder("download")
          .leftJoin("download.download_post_fs", "fullscreenpost")
          .leftJoin("download.downloads_user", "users")
          .select()
          .where("users.useremail = :useremail", { useremail })
          .andWhere("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
          .getCount()) > 0;

      if (isAlreadyLiked) {
        this.createQueryBuilder("download")
          .leftJoin("download.download_post_fs", "fullscreenpost")
          .leftJoin("download.downloads_user", "users")
          .select()
          .where("users.useremail = :useremail", { useremail })
          .andWhere("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
          .getOne()
          .then((data: any) => {
            if (data !== undefined) {
              res.send({
                code: 201,
                data: data,
                isdownload: true,
              });
            } else {
              return res.send({
                code: 302,
                data: "User is not Download",
                isdownload: false,
              });
            }
          });
      } else {
        return res.send({
          code: 301,
          data: "User is not Download",
          isdownload: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchDownloads(req: Request, res: Response) {
    try {
      let { fs_post_id } = req.params;
      let response = await this.createQueryBuilder("download")
        .leftJoin("download.download_post_fs", "fullscreenpost")
        .leftJoin("download.downloads_user", "users")
        .select()
        .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
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

  async fetchDownloadsbyuser(req: Request, res: Response) {
    try {
      let { useremail } = req.params;
      let response = await this.createQueryBuilder("download")
        .leftJoinAndSelect("download.downloads_user", "users")
        .leftJoinAndSelect("download.download_post_fs", "fullscreenpost")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select()
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

  async fetchpostDownloadsbyuser(req: Request, res: Response) {
    try {
      let { useremail } = req.params;
      let response = await this.createQueryBuilder("download")
        .leftJoinAndSelect("download.download_post", "post")
        .leftJoinAndSelect("download.download_post_fs", "fullscreenpost")
        .leftJoin("download.downloads_user", "users")
        .select()
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

  async removedownload(req: Request, res: Response) {
    try {
      let { download_id } = req.params;
      await this.createQueryBuilder("download")
        .delete()
        .from(DownloadEntity)
        .where("download_id = :download_id", { download_id })
        .execute()
        .then((data: any) => {
          let isAffected = data.affected;
          if (isAffected > 0) {
            return res.send({
              code: 201,
              data: "Remove the download",
              removed: true,
            });
          } else {
            return res.send({
              code: 301,
              data: "users is not download",
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

  //! post
  async addDownloadpost(req: Request, res: Response) {
    let { useremail, post_id } = req.body;
    var isAlreadDownloaded =
      (await this.createQueryBuilder("download")
        .leftJoin("download.download_post", "post")
        .leftJoin("download.downloads_user", "users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .andWhere("post.post_id = :post_id", { post_id })
        .getCount()) > 0;

    if (isAlreadDownloaded) {
      return res.send({
        code: 403,
        data: "User is Already Download",
        added: false,
      });
    }

    if (!isAlreadDownloaded) {
      let userRepositiory = getCustomRepository(UserRepository);
      let user = await userRepositiory.findOne({ useremail });

      let postRepositiory = getCustomRepository(PostRepository);
      let postfs = await postRepositiory.findOne({ post_id });

      let downloadEntity = new DownloadEntity();

      downloadEntity.download_post = postfs!;
      downloadEntity.downloads_user = user!;

      await downloadEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "User is Downloaded",
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

  async checkuserDownloadpost(req: Request, res: Response) {
    try {
      let { useremail, post_id } = req.params;

      var isAlreadyLiked =
        (await this.createQueryBuilder("download")
          .leftJoin("download.download_post", "post")
          .leftJoin("download.downloads_user", "users")
          .select()
          .where("users.useremail = :useremail", { useremail })
          .andWhere("post.post_id = :post_id", { post_id })
          .getCount()) > 0;

      if (isAlreadyLiked) {
        this.createQueryBuilder("download")
          .leftJoin("download.download_post", "post")
          .leftJoin("download.downloads_user", "users")
          .select()
          .where("users.useremail = :useremail", { useremail })
          .andWhere("post.post_id = :post_id", { post_id })
          .getOne()
          .then((data: any) => {
            if (data !== undefined) {
              res.send({
                code: 201,
                data: data,
                isdownload: true,
              });
            } else {
              return res.send({
                code: 302,
                data: "User is not Download",
                isdownload: false,
              });
            }
          });
      } else {
        return res.send({
          code: 301,
          data: "User is not Download",
          isdownload: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchDownloadspost(req: Request, res: Response) {
    try {
      let { post_id } = req.params;
      let response = await this.createQueryBuilder("download")
        .leftJoin("download.download_post", "post")
        .leftJoin("download.downloads_user", "users")
        .select()
        .where("post.post_id = :post_id", { post_id })
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
}

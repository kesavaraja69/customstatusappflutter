import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Request, Response } from 'express';
import { BookmarkEntity } from '../entity/bookmark.entity';
import { UserRepository } from '../../authentication/repository/users.repositroy';
import { FullScreenPostRepository } from '../../post_fullscreen/repository/postfullscreen.repository';
import { PostRepository } from '../../posts/repository/post.repository';

@EntityRepository(BookmarkEntity)
export class BookmarkRespositiory extends Repository<BookmarkEntity> {
  async addbookmark(req: Request, res: Response) {
    let { useremail, fs_post_id } = req.body;
    var isAlreadyLiked =
      (await this.createQueryBuilder('bookmark')
        .leftJoin('bookmark.bookmark_post_fs', 'fullscreenpost')
        .leftJoin('bookmark.bookmark_user', 'users')
        .select()
        .where('users.useremail = :useremail', { useremail })
        .andWhere('fullscreenpost.fs_post_id = :fs_post_id', { fs_post_id })
        .getCount()) > 0;

    if (isAlreadyLiked) {
      return res.send({
        code: 403,
        data: 'User is Already Bookmarked',
        added: false,
      });
    }

    if (!isAlreadyLiked) {
      let userRepositiory = getCustomRepository(UserRepository);
      let user = await userRepositiory.findOne({ useremail });

      let postRepositiory = getCustomRepository(FullScreenPostRepository);
      let postfs = await postRepositiory.findOne({ fs_post_id });

      let bookmarkEntity = new BookmarkEntity();

      bookmarkEntity.bookmark_post_fs = postfs!;
      bookmarkEntity.bookmark_user = user!;

      await bookmarkEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: 'Bookmarked successfully',
              added: true,
            });
          }
        })
        .catch((error: any) => {
          if (error) {
            return res.send({
              code: 402,
              data: 'something went wrong',
              added: false,
            });
          }
        });
    }
  }

  async fetchuserBookmark(req: Request, res: Response) {
    try {
      let { useremail } = req.params;

      var response = await this.createQueryBuilder('bookmark')
        .leftJoinAndSelect('bookmark.bookmark_post_fs', 'fullscreenpost')
        .leftJoinAndSelect('bookmark.bookmark_user', 'users')
        .leftJoinAndSelect('users.info', 'usersinfo')
        .select()
        .where('users.useremail = :useremail', { useremail })
        .getMany();
      if (response !== undefined) {
        return res.send({
          code: 201,
          data: response,
        });
      } else {
        return res.send({
          code: 301,
          data: 'no data available',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async checkuserBookmark(req: Request, res: Response) {
    try {
      let { useremail, fs_post_id } = req.params;

      var isAlreadyLiked =
        (await this.createQueryBuilder('bookmark')
          .leftJoin('bookmark.bookmark_post_fs', 'fullscreenpost')
          .leftJoin('bookmark.bookmark_user', 'users')
          .select()
          .where('users.useremail = :useremail', { useremail })
          .andWhere('fullscreenpost.fs_post_id = :fs_post_id', { fs_post_id })
          .getCount()) > 0;

      if (isAlreadyLiked) {
        res.send({
          code: 201,
          data: 'User is Bookmarked',
          isBookmark: true,
        });
      } else {
        return res.send({
          code: 301,
          data: 'User is not Bookmark',
          isBookmark: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchbookmarks(req: Request, res: Response) {
    try {
      let { fs_post_id } = req.params;
      let response = await this.createQueryBuilder('bookmark')
        .leftJoin('bookmark.bookmark_post_fs', 'fullscreenpost')
        .leftJoin('bookmark.bookmark_user', 'users')
        .select()
        .where('fullscreenpost.fs_post_id = :fs_post_id', { fs_post_id })
        .getMany();
      if (response !== undefined) {
        return res.send({
          code: 201,
          data: response,
        });
      } else {
        return res.send({
          code: 301,
          data: 'no data available',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async removebookmark(req: Request, res: Response) {
    try {
      let { bookmark_id } = req.params;
      await this.createQueryBuilder('bookmark')
        .delete()
        .from(BookmarkEntity)
        .where('bookmark_id = :bookmark_id', { bookmark_id })
        .execute()
        .then((data: any) => {
          let isAffected = data.affected;
          if (isAffected > 0) {
            return res.send({
              code: 201,
              data: 'Bookmark removed',
              removed: true,
            });
          } else {
            return res.send({
              code: 301,
              data: 'Bookmark not removed',
              removed: false,
            });
          }
        })
        .catch((error: any) => {
          if (error !== undefined) {
            console.log(error);
            return res.send({
              code: 403,
              data: 'something went wrong',
              removed: false,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  //! post
  async addbookmarkpost(req: Request, res: Response) {
    let { useremail, post_id } = req.body;
    var isAlreadyLiked =
      (await this.createQueryBuilder('bookmark')
        .leftJoin('bookmark.bookmark_post', 'post')
        .leftJoin('bookmark.bookmark_user', 'users')
        .select()
        .where('users.useremail = :useremail', { useremail })
        .andWhere('post.post_id = :post_id', { post_id })
        .getCount()) > 0;

    if (isAlreadyLiked) {
      return res.send({
        code: 403,
        data: 'User is Already Bookmarked',
        added: false,
      });
    }

    if (!isAlreadyLiked) {
      let userRepositiory = getCustomRepository(UserRepository);
      let user = await userRepositiory.findOne({ useremail });

      let postRepositiory = getCustomRepository(PostRepository);
      let postfs = await postRepositiory.findOne({ post_id });

      let bookmarkEntity = new BookmarkEntity();

      bookmarkEntity.bookmark_post = postfs!;
      bookmarkEntity.bookmark_user = user!;

      await bookmarkEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: 'Bookmarked successfully',
              added: true,
            });
          }
        })
        .catch((error: any) => {
          if (error) {
            return res.send({
              code: 402,
              data: 'something went wrong',
              added: false,
            });
          }
        });
    }
  }

  async checkuserBookmarkpost(req: Request, res: Response) {
    try {
      let { useremail, post_id } = req.params;

      var isAlreadyLiked =
        (await this.createQueryBuilder('bookmark')
          .leftJoin('bookmark.bookmark_post', 'post')
          .leftJoin('bookmark.bookmark_user', 'users')
          .select()
          .where('users.useremail = :useremail', { useremail })
          .andWhere('post.post_id = :post_id', { post_id })
          .getCount()) > 0;

      if (isAlreadyLiked) {
        return res.send({
          code: 201,
          data: 'User is Bookmarked',
          isBookmark: true,
        });
      } else {
        return res.send({
          code: 301,
          data: 'User is not Bookmark',
          isBookmark: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchbookmarkspost(req: Request, res: Response) {
    try {
      let { post_id, useremail } = req.params;
      let response = await this.createQueryBuilder('bookmark')
        .leftJoin('bookmark.bookmark_post', 'post')
        .leftJoin('bookmark.bookmark_user', 'users')
        .select()
        .where('post.post_id = :post_id', { post_id })
        .andWhere('users.useremail = :useremail', { useremail })
        .getOne();
      if (response !== undefined) {
        return res.send({
          code: 201,
          data: response,
          message: 'fetched sucessfully',
        });
      } else {
        return res.send({
          code: 301,
          data: null,
          message: 'no data available',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

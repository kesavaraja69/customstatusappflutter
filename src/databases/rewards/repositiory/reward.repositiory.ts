import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { RewardEntity } from '../entity/reward.entity';
import { Request, Response } from 'express';
import { UserRepository } from '../../authentication/repository/users.repositroy';
import { PostRepository } from '../../posts/repository/post.repository';
import { FullScreenPostRepository } from '../../post_fullscreen/repository/postfullscreen.repository';
@EntityRepository(RewardEntity)
export class RewardpointRepository extends Repository<RewardEntity> {
  async adduserpoints(req: Request, res: Response) {
    let {
      useremail,
      postname,
      reward_points,
      reward_type,
      post_id,
      fs_post_id,
    } = req.body;

    let userRepositiory = getCustomRepository(UserRepository);
    let user = await userRepositiory.findOne({ useremail });

    let postRepositiory = getCustomRepository(PostRepository);
    let postid = await postRepositiory.findOne({ post_id });

    let fspostRepositiory = getCustomRepository(FullScreenPostRepository);
    let fspostid = await fspostRepositiory.findOne({ fs_post_id });

    let rewardEntity = new RewardEntity();
    rewardEntity.reward_postname = postname!;
    rewardEntity.reward_user = user!;
    rewardEntity.reward_points = reward_points;
    rewardEntity.reward_type = reward_type;

    if (
      reward_type == 'normalvideopost' ||
      reward_type == 'youtubepost' ||
      reward_type == 'normalimagepost'
    ) {
      rewardEntity.reward_post = postid!;
    } else {
      rewardEntity.reward_post_fs = fspostid!;
    }

    if (user !== undefined) {
      await rewardEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: 'User is point added',
              added: true,
            });
          } else {
            return res.send({
              code: 403,
              data: 'point is not added',
              added: false,
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
    } else {
      return res.send({
        code: 406,
        data: 'user not found',
        added: false,
      });
    }
  }

  async fetchPostreward(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let post = await this.createQueryBuilder('rewardpoint')
        .leftJoin('rewardpoint.reward_user', 'users')
        .leftJoinAndSelect('rewardpoint.reward_post', 'post')
        .leftJoinAndSelect('rewardpoint.reward_post_fs', 'fullscreenpost')
        .select()
        .where('users.useremail = :useremail', { useremail })
        .getMany();
      if (post !== undefined) {
        res.send({
          code: 201,
          data: post,
          message: 'Fetched Sucessfully',
          received: true,
        });
      } else {
        res.send({
          code: 403,
          data: null,
          message: 'not fetched',
          received: false,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: null,
          message: 'something went wrong,try again',
          received: false,
        });
      }
    }
  }

  async removerewardpoint(req: Request, res: Response) {
    try {
      let { reward_id, useremail } = req.params;
      await this.createQueryBuilder('rewardpoint')
        // .leftJoin('rewardpoint.reward_user', 'users')
        .delete()
        .from(RewardEntity)
        .where('reward_id = :reward_id', { reward_id })
        //.andWhere('users.useremail = :useremail', { useremail })
        .execute()
        .then((data: any) => {
          let isAffected = data.affected;
          if (isAffected > 0) {
            return res.send({
              code: 201,
              data: 'reward removed',
              removed: true,
            });
          } else {
            return res.send({
              code: 301,
              data: 'not removed',
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
}

import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { RewardEntity } from "../entity/reward.entity";
import { Request, Response } from "express";
import { UserRepository } from "../../authentication/repository/users.repositroy";
@EntityRepository(RewardEntity)
export class RewardpointRepository extends Repository<RewardEntity> {
  async adduserpoints(req: Request, res: Response) {
    let { useremail, postname, reward_points, reward_type, } =
      req.body;
    let userRepositiory = getCustomRepository(UserRepository);
    let user = await userRepositiory.findOne({ useremail });

    let rewardEntity = new RewardEntity();
    rewardEntity.reward_postname = postname!;
    rewardEntity.reward_user = user!;
    rewardEntity.reward_points = reward_points;
    rewardEntity.reward_type = reward_type;

    if (user !== undefined) {
      await rewardEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "User is point added",
              added: true,
            });
          } else {
            return res.send({
              code: 403,
              data: "point is not added",
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
    } else {
      return res.send({
        code: 406,
        data: "user not found",
        added: false,
      });
    }
  }

  async fetchPostreward(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let post = await this.createQueryBuilder("rewardpoint")
        .leftJoin("rewardpoint.reward_user", "users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .getMany();
      if (post !== undefined) {
        res.send({
          code: 201,
          data: post,
          message: "Fetched Sucessfully",
          received: true,
        });
      } else {
        res.send({
          code: 403,
          data: null,
          message: "not fetched",
          received: false,
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

}

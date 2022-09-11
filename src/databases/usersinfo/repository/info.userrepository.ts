import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Request, Response } from "express";
import { UserInfoEntity } from "../entity/user.infoentity";
import { UserRepository } from "../../authentication/repository/users.repositroy";

@EntityRepository(UserInfoEntity)
export class UserInfoRepository extends Repository<UserInfoEntity> {
  async submitUserInfo(req: Request, res: Response) {
    let { useremail, aboutyourself, profileimage } = req.body;

    try {
      let userRepository = getCustomRepository(UserRepository);
      let user = await userRepository.findOne({ useremail });
      if (user !== undefined) {
        let userinfo = new UserInfoEntity();
        userinfo.aboutyourself = aboutyourself;
        userinfo.profileimage = profileimage;
        userinfo.user = user!;
        await userinfo.save();
        res.send({
          code: 201,
          message: "infromation saved",
        });
      } else {
        res.send({
          code: 403,
          message: "user not found",
        });
      }
    } catch (error) {
      res.send({
        code: 404,
        message: "something went wrong",
      });
    }
  }

  async fetchallrewardpointbyuser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let post = await this.createQueryBuilder("usersinfo")
        .select(["usersinfo.reward_All_points", "usersinfo.info_id"])
        .leftJoin("usersinfo.user", "users")
        .where("users.useremail = :useremail", { useremail })
        .getOne();

      if (useremail !== undefined) {
        if (post !== undefined) {
          res.send({
            code: 201,
            data: post,
            message: "Fetched Sucessfully",
            received: true,
          });
        } else {
          res.send({
            code: 304,
            data: post,
            message: "not Fetched",
            received: true,
          });
        }
      } else {
        res.send({
          code: 403,
          data: post,
          message: "user not found",
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

  async updateuserProfile(req: Request, res: Response) {
    let { useremail, aboutyourself, profileimage, info_id } = req.body;
    try {
      let userRepository = getCustomRepository(UserRepository);
      let user = await userRepository.findOne({ useremail });
      if (user != undefined) {
        await this.createQueryBuilder("usersinfo")
          .update(UserInfoEntity)
          .set({ aboutyourself, profileimage })
          .where("usersinfo.info_id = :info_id", { info_id })
          .execute()
          .then((data: any) => {
            var affected = data.affected;
            if (affected > 0) {
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
      } else {
        return res.send({
          code: 303,
          message: "user not found",
          submitted: false,
        });
      }
    } catch (error) {
      return res.send({
        code: 403,
        message: "something went wrong",
        submitted: false,
      });
    }
  }
}

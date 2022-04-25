import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Request, Response } from "express";
import { AmountEntity } from "../entity/amount.entity";
import { UserRepository } from "../../authentication/repository/users.repositroy";

@EntityRepository(AmountEntity)
export class RewardpointRepository extends Repository<AmountEntity> {
  async adduseramount(req: Request, res: Response) {
    let { useremail, totalamount } = req.body;
    let userRepositiory = getCustomRepository(UserRepository);
    let user = await userRepositiory.findOne({ useremail });

    let amountEntity = new AmountEntity();

    amountEntity.amount_user = user!;
    amountEntity.reward_All_amount = totalamount!;

    if (user !== undefined) {
      await amountEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "User is amount added",
              added: true,
            });
          } else {
            return res.send({
              code: 403,
              data: "amount is not added",
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

  //! user amount
  async fetchallrewardpointbyuser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let post = await this.createQueryBuilder("userrewardamount")
        .leftJoin("userrewardamount.amount_user", "users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .getMany();

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
}

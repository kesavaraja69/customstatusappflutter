import {
  EntityRepository,
  getCustomRepository,
  getRepository,
  Repository,
} from "typeorm";
import { Request, Response } from "express";
import { AmountEntity } from "../entity/amount.entity";
import { UserRepository } from "../../authentication/repository/users.repositroy";
import { UserEntity } from "../../authentication/entity/users.entity";

@EntityRepository(AmountEntity)
export class AmountRepository extends Repository<AmountEntity> {
  async adduseramount(req: Request, res: Response) {
    let { useremail, totalamount } = req.body;
    let userRepositiory = getCustomRepository(UserRepository);
    let user = await userRepositiory.findOne({ useremail });

    let amountEntity = new AmountEntity();
    amountEntity.amount_user = user!;

    if (user !== undefined) {
      await amountEntity
        .save()
        .then(async (data: any) => {
          if (data !== undefined) {
            await getRepository(UserEntity)
              .createQueryBuilder("users")
              .select(["users.reward_total_amount"])
              .where("users.useremail = :useremail", { useremail })
              .getOne()
              .then(async (data: any) => {
                let data1: any = Object.values(data);
                console.log(`amount is ${data1}`);
                if (305 >= 300 && totalamount <= 305) {
                  console.log(`amount is approved`);
                  amountEntity.payout_All_amount = totalamount!;
                  await amountEntity
                    .save()
                    .then((data: any) => {
                      if (data) {
                        res.send({
                          code: 201,
                          message: "payment request is sucessful",
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
                  console.log(`amount is not approved`);
                  return res.send({
                    code: 303,
                    added: false,
                  });
                }
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
              code: 407,
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
  //  parseInt(data1)
  //! user amount
  async fetchallrewardamountbyuser(req: Request, res: Response) {
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

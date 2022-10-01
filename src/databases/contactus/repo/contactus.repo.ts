import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { ContactusEntity } from "../enitiy/contactus.entity";
import { Request, Response } from "express";
import { UserRepository } from "../../authentication/repository/users.repositroy";
@EntityRepository(ContactusEntity)
export class ContactusRepository extends Repository<ContactusEntity> {
  async adduserreportandcontactus(req: Request, res: Response) {
    let { useremail, usname, usmessage, iscontactus } = req.body;
    let userRepositiory = getCustomRepository(UserRepository);
    let user = await userRepositiory.findOne({ useremail });

    let contactEntity = new ContactusEntity();
    contactEntity.log_user = user!;
    contactEntity.contactus_name = usname;
    contactEntity.contactus_email = useremail;
    contactEntity.contactus_message = usmessage;
    contactEntity.iscontactus = iscontactus;
    if (user !== undefined) {
      await contactEntity
        .save()
        .then((data: any) => {
          if (data !== undefined) {
            return res.send({
              code: 201,
              data: "message send Successfuly",
              added: true,
            });
          } else {
            return res.send({
              code: 202,
              data: "message not send",
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

  async fetchuserreportandcontactus(req: Request, res: Response) {
    try {
      let contactus = await this.createQueryBuilder("contactus")
        .leftJoin("contactus.log_user", "users")
        .select()
        .getMany();

      if (contactus !== undefined) {
        res.send({
          code: 201,
          data: contactus,
          message: "Fetched Sucessfully",
          received: true,
        });
      } else {
        res.send({
          code: 203,
          data: null,
          message: "data not Fetched",
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

  async fetchuserreportorcontactus(req: Request, res: Response) {
    let { iscontactus } = req.params;
    try {
      let contactus = await this.createQueryBuilder("contactus")
        .leftJoin("contactus.log_user", "users")
        .select()
        .where("contactus.iscontactus = :iscontactus", {
          iscontactus: iscontactus,
        })
        .getMany();

      if (contactus !== undefined) {
        res.send({
          code: 201,
          data: contactus,
          message: "Fetched Sucessfully",
          received: true,
        });
      } else {
        res.send({
          code: 203,
          data: null,
          message: "data not Fetched",
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

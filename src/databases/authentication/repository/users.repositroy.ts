import { BaseEntity, Double, EntityRepository, Repository } from "typeorm";
import { UserEntity } from "../entity/users.entity";
import { Request, Response } from "express";
import { json } from "stream/consumers";

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async submitUserData(req: Request, res: Response, hashedpassword: string) {
    let { useremail, username } = req.body;

    let isExiting =
      (await this.createQueryBuilder("users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .getCount()) > 0;

    if (isExiting) {
      return res.send({
        user: null,
        message: "user is already exsiting",
        authenticated: false,
        code: 400,
      });
    } else {
      this.createQueryBuilder("users")
        .insert()
        .values({
          useremail,
          username,
          reward_total_amount: "0",
          reward_All_points: "0",
          reward_today_points: "0",
          reward_user_level: "1",
          is_completed_todaytask: false,
          userpassword: hashedpassword,
        })
        .execute();
    }
  }

  async fetchuserMyConnection(req: Request, res: Response) {
    let { user_email } = req.params;
    try {
      let response = await this.createQueryBuilder("users")
        .leftJoinAndSelect("users.to_userconnection_data", "connection")
        .select()
        .where("connection.from_connection_email = :user_email", { user_email })
        .getMany();

      if (response !== undefined) {
        res.send({
          code: 201,
          data: response,
          recived: true,
        });
      }
    } catch (error) {
      res.send({
        code: 201,
        data: null,
        recived: false,
      });
    }
  }

  async checkUserData(req: Request, res: Response) {
    let { useremail } = req.params;
    let isExiting: boolean =
      (await this.createQueryBuilder("users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .getCount()) > 0;
    if (isExiting) {
      return res.send({
        user: useremail,
        message: "user is already exsiting",
        authenticated: true,
        code: 201,
      });
    } else {
      return res.send({
        user: null,
        message: "user not found",
        authenticated: false,
        code: 407,
      });
    }
  }

  async fetchUserData(req: Request, res: Response) {
    let { useremail } = req.params;
    let userdata = await this.createQueryBuilder("users")
      .leftJoinAndSelect("users.info", "usersinfo")
      .leftJoinAndSelect("users.fullscreenvideo", "fullscreenpost")
      .leftJoinAndSelect("users.to_userconnection_data", "connection")
      .select([
        "users.useremail",
        "users.username",
        "users.id",
        "usersinfo",
        "fullscreenpost",
        "connection",
      ])
      .where("users.useremail = :useremail", { useremail })
      .getOne();
    if (userdata != null) {
      return res.send({
        data: userdata,
        authenticated: true,
        code: 201,
      });
    } else {
      return res.send({
        message: "user not found",
        authenticated: false,
        code: 407,
      });
    }
  }

  async fetchUserInfoData(req: Request, res: Response) {
    let { useremail } = req.params;
    let userdata = await this.createQueryBuilder("users")
      .leftJoinAndSelect("users.info", "usersinfo")
      .select()
      .where("users.useremail = :useremail", { useremail })
      .getOne();
    if (userdata != null) {
      return res.send({
        data: userdata,
        authenticated: true,
        code: 201,
      });
    } else {
      return res.send({
        message: "user not found",
        authenticated: false,
        code: 407,
      });
    }
  }

  async findUserPassword(useremail: string, res: Response) {
    let baseUser = await this.createQueryBuilder("users")
      .select()
      .where("users.useremail = :useremail", { useremail })
      .getOne();

    if (baseUser == undefined) {
      res.send({
        user: null,
        message: "account not found",
        authenticated: false,
        code: 402,
      });
    }

    let baseUserpassword = baseUser!.userpassword;
    return baseUserpassword;
  }

  //! fetch fullscreenstatus comments
  async fetchComment(req: Request, res: Response) {
    let { fs_post_id } = req.params;
    try {
      let response = await this.createQueryBuilder("users")
        .leftJoinAndSelect("users.fullscreenvideo", "fullscreenpost")
        .leftJoinAndSelect("users.user_comment", "comment")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select()
        .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .getMany();

      let data1 = response.length > 0;
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

  //! fetch post comments
  async fetchpostComment(req: Request, res: Response) {
    let { post_id } = req.params;
    try {
      let response = await this.createQueryBuilder("users")
        .leftJoinAndSelect("users.post", "post")
        .leftJoinAndSelect("users.user_comment", "comment")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select()
        .where("post.post_id = :post_id", { post_id })
        .getMany();

      let data1 = response.length > 0;
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

  //! user rewards
  async fetchallrewardpointbyuser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let post = await this.createQueryBuilder("users")
        .select([
          "users.reward_All_points",
          "users.id",
          "users.reward_total_amount",
        ])
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

  async fetchtodayrewardpointbyuser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let post = await this.createQueryBuilder("users")
        .select([
          "users.reward_today_points",
          "users.id",
          "users.is_completed_todaytask",
        ])
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

  //! reward with full points and amount
  async updateamountpoint(req: Request, res: Response) {
    let { useremail, reward_All_points, reward_total_amount, post_type } =
      req.body;

    let data2: any;
    let fnusamount: any;
    let usertodaypoint: any;
    let usertodayamount: any;
    try {
      let isExiting: boolean =
        (await this.createQueryBuilder("users")
          .select()
          .where("users.useremail = :useremail", { useremail })
          .getCount()) > 0;

      await this.createQueryBuilder("users")
        .select(["users.reward_All_points", "users.reward_user_level"])
        .where("users.useremail = :useremail", { useremail })
        .getOne()
        .then(async (data: any) => {
          let data1: any = Object.values(data);
          //  let data2: any = parseInt(data1) + 2;
          let userlevel: any = Object.values(data);

          if (userlevel[0] == "1") {
            console.log(`level is ${userlevel[0]}`);

            await this.createQueryBuilder("users")
              .select(["users.reward_total_amount"])
              .where("users.useremail = :useremail", { useremail })
              .getOne()
              .then((data: any) => {
                let dataam: any = Object.values(data);
                //  let data2: any = parseInt(data1) + 2;

                switch (post_type) {
                  case "fullscreenpost":
                    if (dataam == "0") {
                      fnusamount = 1.7;
                      usertodayamount = 1.7;
                    } else {
                      fnusamount = 1.7 + parseFloat(dataam);
                      usertodayamount = 1.7;
                    }
                    break;
                  case "normalvideopost":
                    if (dataam == "0") {
                      fnusamount = 1.2;
                      usertodayamount = 1.2;
                    } else {
                      fnusamount = 1.2 + parseFloat(dataam);
                      usertodayamount = 1.2;
                    }
                    break;
                  case "youtubepost":
                    if (dataam == "0") {
                      fnusamount = 2;
                      usertodayamount = 2;
                    } else {
                      fnusamount = 2 + parseFloat(dataam);
                      usertodayamount = 2;
                    }
                    break;
                  case "normalimagepost":
                    if (dataam == "0") {
                      fnusamount = 1;
                      usertodayamount = 1;
                    } else {
                      fnusamount = 1 + parseFloat(dataam);
                      usertodayamount = 1;
                    }
                    break;
                  default:
                    fnusamount = 0;
                    usertodayamount = 0;
                    break;
                }
                console.log(`amount is ${fnusamount}`);
              });

            switch (post_type) {
              case "fullscreenpost":
                if (data1[1] == "0") {
                  data2 = 17;
                  usertodaypoint = 17;
                } else {
                  data2 = parseInt(data1[1]) + 17;
                  usertodaypoint = 17;
                }
                break;
              case "normalvideopost":
                if (data1[1] == "0") {
                  data2 = 12;
                  usertodaypoint = 12;
                } else {
                  data2 = 12 + parseInt(data1[1]);
                  usertodaypoint = 12;
                }
                break;
              case "youtubepost":
                if (data1[1] == "0") {
                  data2 = 20;
                  usertodaypoint = 20;
                } else {
                  data2 = parseInt(data1[1]) + 20;
                  usertodaypoint = 20;
                }
                break;
              case "normalimagepost":
                if (data1[1] == "0") {
                  data2 = 10;
                  usertodaypoint = 10;
                } else {
                  data2 = parseInt(data1[1]) + 10;
                  usertodaypoint = 10;
                }
                break;
              default:
                if (data1[1] == "0") {
                  usertodaypoint = 0;
                  data2 = 0;
                } else {
                  usertodaypoint = 0;
                  data2 = parseInt(data1[1]) + 0;
                }
                break;
            }
            console.log(`point is ${data2}`);
          } else if (userlevel[0] == "2") {
            console.log(`level is ${userlevel[0]}`);

            await this.createQueryBuilder("users")
              .select(["users.reward_total_amount"])
              .where("users.useremail = :useremail", { useremail })
              .getOne()
              .then((data: any) => {
                let data1: any = Object.values(data);
                //  let data2: any = parseInt(data1) + 2;

                switch (post_type) {
                  case "fullscreenpost":
                    if (data2 == "0") {
                      fnusamount = 1.7;
                    } else {
                      fnusamount = 1.7 + parseFloat(data1);
                    }
                    break;
                  case "normalvideopost":
                    if (data2 == "0") {
                      fnusamount = 1.2;
                    } else {
                      fnusamount = 1.2 + parseFloat(data1);
                    }
                    break;
                  case "youtubepost":
                    if (data2 == "0") {
                      fnusamount = 2;
                    } else {
                      fnusamount = 2 + parseFloat(data1);
                    }
                    break;
                  case "normalimagepost":
                    if (data2 == "0") {
                      fnusamount = 1;
                    } else {
                      fnusamount = 1 + parseFloat(data1);
                    }
                    break;
                  default:
                    fnusamount = 0;
                    break;
                }
                console.log(`amount is ${fnusamount}`);
              });

            switch (post_type) {
              case "fullscreenpost":
                if (data1[1] == "0") {
                  data2 = 17;
                } else {
                  data2 = parseInt(data1) + 17;
                }
                break;
              case "normalvideopost":
                if (data1 == "0") {
                  data2 = 12;
                } else {
                  data2 = parseInt(data1) + 12;
                }
                break;
              case "youtubepost":
                if (data1 == "0") {
                  data2 = 20;
                } else {
                  data2 = parseInt(data1) + 20;
                }
                break;
              case "normalimagepost":
                if (data1 == "0") {
                  data2 = 10;
                } else {
                  data2 = parseInt(data1) + 10;
                }
                break;
              default:
                if (data1 == "0") {
                  data2 = 0;
                } else {
                  data2 = parseInt(data1) + 0;
                }
                break;
            }
            console.log(`point is ${data2}`);
          } else if (userlevel[0] == "3") {
            console.log(`level is ${userlevel[0]}`);

            await this.createQueryBuilder("users")
              .select(["users.reward_total_amount"])
              .where("users.useremail = :useremail", { useremail })
              .getOne()
              .then((data: any) => {
                let data1: any = Object.values(data);
                //  let data2: any = parseInt(data1) + 2;

                switch (post_type) {
                  case "fullscreenpost":
                    if (data2 == "0") {
                      fnusamount = 1.7;
                    } else {
                      fnusamount = 1.7 + parseFloat(data1);
                    }
                    break;
                  case "normalvideopost":
                    if (data2 == "0") {
                      fnusamount = 1.2;
                    } else {
                      fnusamount = 1.2 + parseFloat(data1);
                    }
                    break;
                  case "youtubepost":
                    if (data2 == "0") {
                      fnusamount = 2;
                    } else {
                      fnusamount = 2 + parseFloat(data1);
                    }
                    break;
                  case "normalimagepost":
                    if (data2 == "0") {
                      fnusamount = 1;
                    } else {
                      fnusamount = 1 + parseFloat(data1);
                    }
                    break;
                  default:
                    fnusamount = 0;
                    break;
                }
                console.log(`amount is ${fnusamount}`);
              });

            switch (post_type) {
              case "fullscreenpost":
                if (data1[1] == "0") {
                  data2 = 17;
                } else {
                  data2 = parseInt(data1) + 17;
                }
                break;
              case "normalvideopost":
                if (data1 == "0") {
                  data2 = 12;
                } else {
                  data2 = parseInt(data1) + 12;
                }
                break;
              case "youtubepost":
                if (data1 == "0") {
                  data2 = 20;
                } else {
                  data2 = parseInt(data1) + 20;
                }
                break;
              case "normalimagepost":
                if (data1 == "0") {
                  data2 = 10;
                } else {
                  data2 = parseInt(data1) + 10;
                }
                break;
              default:
                if (data1 == "0") {
                  data2 = 0;
                } else {
                  data2 = parseInt(data1) + 0;
                }
                break;
            }
            console.log(`point is ${data2}`);
          }
        });

      if (isExiting) {
        await this.createQueryBuilder("users")
          .update(UserEntity)
          .set({
            reward_All_points: data2.toString(),
            reward_total_amount: fnusamount.toString(),
            reward_today_points: data2.toString(),
          })
          .where("users.useremail = :useremail", { useremail })
          .execute()
          .then((data: any) => {
            var affected = data.affected;
            if (affected > 0) {
              return res.send({
                code: 201,
                point: usertodaypoint,
                amount: usertodayamount,
                message: "updated Sucessfully",
                submitted: true,
              });
            } else {
              return res.send({
                code: 301,
                point: null,
                amount: null,
                message: "not updated",
                submitted: false,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.send({
              code: 401,
              point: null,
              amount: null,
              message: "something went wrong",
              submitted: false,
            });
          });
      } else {
        return res.send({
          code: 303,
          point: null,
          amount: null,
          message: "user not found",
          submitted: false,
        });
      }
    } catch (error) {
      return res.send({
        code: 403,
        point: null,
        amount: null,
        message: "something went wrong",
        submitted: false,
      });
    }
  }

  //! rewards with low and full point
  async updatewithlowamountpoint(req: Request, res: Response) {
    let { useremail, post_type, adloaded } = req.body;

    let data2: any;
    let fnusamount: any;
    let usertodaypoint: any;
    let usertodayamount: any;
    try {
      let isExiting: boolean =
        (await this.createQueryBuilder("users")
          .select()
          .where("users.useremail = :useremail", { useremail })
          .getCount()) > 0;

      await this.createQueryBuilder("users")
        .select(["users.reward_All_points", "users.reward_user_level"])
        .where("users.useremail = :useremail", { useremail })
        .getOne()
        .then(async (data: any) => {
          let data1: any = Object.values(data);
          //  let data2: any = parseInt(data1) + 2;
          let userlevel: any = Object.values(data);

          if (userlevel[0] == "1") {
            console.log(`level is ${userlevel[0]}`);

            await this.createQueryBuilder("users")
              .select(["users.reward_total_amount"])
              .where("users.useremail = :useremail", { useremail })
              .getOne()
              .then((data: any) => {
                let dataam: any = Object.values(data);
                //  let data2: any = parseInt(data1) + 2;

                switch (post_type) {
                  case "fullscreenpost":
                    if (dataam == "0") {
                      fnusamount = 1.7;
                      usertodayamount = 1.7;
                    } else {
                      fnusamount = 1.7 + parseFloat(dataam);
                      usertodayamount = 1.7;
                    }
                    break;
                  case "normalvideopost":
                    if (dataam == "0") {
                      fnusamount = 1.2;
                      usertodayamount = 1.2;
                    } else {
                      fnusamount = 1.2 + parseFloat(dataam);
                      usertodayamount = 1.2;
                    }
                    break;
                  case "youtubepost":
                    if (dataam == "0") {
                      fnusamount = 2;
                      usertodayamount = 2;
                    } else {
                      fnusamount = 2 + parseFloat(dataam);
                      usertodayamount = 2;
                    }
                    break;
                  case "normalimagepost":
                    if (dataam == "0") {
                      fnusamount = 1;
                      usertodayamount = 1;
                    } else {
                      fnusamount = 1 + parseFloat(dataam);
                      usertodayamount = 1;
                    }
                    break;
                  default:
                    fnusamount = 0;
                    usertodayamount = 0;
                    break;
                }
                console.log(`amount is ${fnusamount}`);
              });

            switch (post_type) {
              case "fullscreenpost":
                if (data1[1] == "0") {
                  if (adloaded == true) {
                    data2 = 17;
                    usertodaypoint = 17;
                  } else {
                    data2 = 3;
                  }
                } else if (adloaded == true) {
                  data2 = parseInt(data1[1]) + 17;
                  usertodaypoint = 17;
                } else {
                  data2 = parseInt(data1[1]) + 3;
                }
                break;
              case "normalvideopost":
                if (data1[1] == "0") {
                  if (adloaded == true) {
                    data2 = 12;
                    usertodaypoint = 12;
                  } else {
                    data2 = 3;
                  }
                } else if (adloaded == true) {
                  data2 = 12 + parseInt(data1[1]);
                  usertodaypoint = 12;
                } else {
                  data2 = parseInt(data1[1]) + 3;
                }
                break;
              case "youtubepost":
                if (data1[1] == "0") {
                  if (adloaded == true) {
                    data2 = 20;
                    usertodaypoint = 20;
                  } else {
                    data2 = parseInt(data1[1]) + 4;
                  }
                } else if (adloaded == true) {
                  data2 = parseInt(data1[1]) + 20;
                  usertodaypoint = 20;
                } else {
                  data2 = parseInt(data1[1]) + 4;
                }
                break;
              case "normalimagepost":
                if (data1[1] == "0") {
                  if (adloaded == true) {
                    data2 = 10;
                    usertodaypoint = 10;
                  } else {
                    data2 = parseInt(data1[1]) + 2;
                  }
                } else if (adloaded == true) {
                  data2 = parseInt(data1[1]) + 10;
                  usertodaypoint = 10;
                } else {
                  data2 = parseInt(data1[1]) + 2;
                }
                break;
              default:
                if (data1[1] == "0") {
                  usertodaypoint = 0;
                  data2 = 0;
                } else {
                  usertodaypoint = 0;
                  data2 = parseInt(data1[1]) + 0;
                }
                break;
            }
            console.log(`point is ${data2}`);
          } else if (userlevel[0] == "2") {
            console.log(`level is ${userlevel[0]}`);

            await this.createQueryBuilder("users")
              .select(["users.reward_total_amount"])
              .where("users.useremail = :useremail", { useremail })
              .getOne()
              .then((data: any) => {
                let data1: any = Object.values(data);
                //  let data2: any = parseInt(data1) + 2;

                switch (post_type) {
                  case "fullscreenpost":
                    if (data2 == "0") {
                      fnusamount = 1.7;
                    } else {
                      fnusamount = 1.7 + parseFloat(data1);
                    }
                    break;
                  case "normalvideopost":
                    if (data2 == "0") {
                      fnusamount = 1.2;
                    } else {
                      fnusamount = 1.2 + parseFloat(data1);
                    }
                    break;
                  case "youtubepost":
                    if (data2 == "0") {
                      fnusamount = 2;
                    } else {
                      fnusamount = 2 + parseFloat(data1);
                    }
                    break;
                  case "normalimagepost":
                    if (data2 == "0") {
                      fnusamount = 1;
                    } else {
                      fnusamount = 1 + parseFloat(data1);
                    }
                    break;
                  default:
                    fnusamount = 0;
                    break;
                }
                console.log(`amount is ${fnusamount}`);
              });

            switch (post_type) {
              case "fullscreenpost":
                if (data1[1] == "0") {
                  data2 = 17;
                } else {
                  data2 = parseInt(data1) + 17;
                }
                break;
              case "normalvideopost":
                if (data1 == "0") {
                  data2 = 12;
                } else {
                  data2 = parseInt(data1) + 12;
                }
                break;
              case "youtubepost":
                if (data1 == "0") {
                  data2 = 20;
                } else {
                  data2 = parseInt(data1) + 20;
                }
                break;
              case "normalimagepost":
                if (data1 == "0") {
                  data2 = 10;
                } else {
                  data2 = parseInt(data1) + 10;
                }
                break;
              default:
                if (data1 == "0") {
                  data2 = 0;
                } else {
                  data2 = parseInt(data1) + 0;
                }
                break;
            }
            console.log(`point is ${data2}`);
          } else if (userlevel[0] == "3") {
            console.log(`level is ${userlevel[0]}`);

            await this.createQueryBuilder("users")
              .select(["users.reward_total_amount"])
              .where("users.useremail = :useremail", { useremail })
              .getOne()
              .then((data: any) => {
                let data1: any = Object.values(data);
                //  let data2: any = parseInt(data1) + 2;

                switch (post_type) {
                  case "fullscreenpost":
                    if (data2 == "0") {
                      fnusamount = 1.7;
                    } else {
                      fnusamount = 1.7 + parseFloat(data1);
                    }
                    break;
                  case "normalvideopost":
                    if (data2 == "0") {
                      fnusamount = 1.2;
                    } else {
                      fnusamount = 1.2 + parseFloat(data1);
                    }
                    break;
                  case "youtubepost":
                    if (data2 == "0") {
                      fnusamount = 2;
                    } else {
                      fnusamount = 2 + parseFloat(data1);
                    }
                    break;
                  case "normalimagepost":
                    if (data2 == "0") {
                      fnusamount = 1;
                    } else {
                      fnusamount = 1 + parseFloat(data1);
                    }
                    break;
                  default:
                    fnusamount = 0;
                    break;
                }
                console.log(`amount is ${fnusamount}`);
              });

            switch (post_type) {
              case "fullscreenpost":
                if (data1[1] == "0") {
                  data2 = 17;
                } else {
                  data2 = parseInt(data1) + 17;
                }
                break;
              case "normalvideopost":
                if (data1 == "0") {
                  data2 = 12;
                } else {
                  data2 = parseInt(data1) + 12;
                }
                break;
              case "youtubepost":
                if (data1 == "0") {
                  data2 = 20;
                } else {
                  data2 = parseInt(data1) + 20;
                }
                break;
              case "normalimagepost":
                if (data1 == "0") {
                  data2 = 10;
                } else {
                  data2 = parseInt(data1) + 10;
                }
                break;
              default:
                if (data1 == "0") {
                  data2 = 0;
                } else {
                  data2 = parseInt(data1) + 0;
                }
                break;
            }
            console.log(`point is ${data2}`);
          }
        });

      if (isExiting) {
        await this.createQueryBuilder("users")
          .update(UserEntity)
          .set({
            reward_All_points: data2.toString(),
            reward_total_amount: fnusamount.toString(),
            reward_today_points: usertodaypoint.toString(),
          })
          .where("users.useremail = :useremail", { useremail })
          .execute()
          .then((data: any) => {
            var affected = data.affected;
            if (affected > 0) {
              return res.send({
                code: 201,
                point: usertodaypoint,
                amount: usertodayamount,
                message: "updated Sucessfully",
                submitted: true,
              });
            } else {
              return res.send({
                code: 301,
                point: null,
                amount: null,
                message: "not updated",
                submitted: false,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            return res.send({
              code: 401,
              point: null,
              amount: null,
              message: "something went wrong",
              submitted: false,
            });
          });
      } else {
        return res.send({
          code: 303,
          point: null,
          amount: null,
          message: "user not found",
          submitted: false,
        });
      }
    } catch (error) {
      return res.send({
        code: 403,
        point: null,
        amount: null,
        message: "something went wrong",
        submitted: false,
      });
    }
  }

  //! rewards daily compelete update
  async updatetodaypoint(req: Request, res: Response) {
    let {
      useremail,
      reward_today_points,
      is_completed_todaytask,
      todaytask_date,
    } = req.body;
    try {
      let isExiting: boolean =
        (await this.createQueryBuilder("users")
          .select()
          .where("users.useremail = :useremail", { useremail })
          .getCount()) > 0;

      if (isExiting) {
        await this.createQueryBuilder("users")
          .update(UserEntity)
          .set({ reward_today_points, is_completed_todaytask, todaytask_date })
          .where("users.useremail = :useremail", { useremail })
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

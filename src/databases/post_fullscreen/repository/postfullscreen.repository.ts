import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { FullScreenPostEntity } from "../entity/postfullscreen.entity";
import { UserRepository } from "../../authentication/repository/users.repositroy";
import { CategoryRepository } from "../../categorys/repositroy/category.repositroy";
import ImageKit from "imagekit";

import fs from "fs";
import multer from "multer";
import { MyArrayslist, Root } from "../../../models/imagesdt";

dotenv.config();
@EntityRepository(FullScreenPostEntity)
export class FullScreenPostRepository extends Repository<FullScreenPostEntity> {
  async submitFullScreenPost(req: Request, res: Response) {
    let admin_token = req.headers.authorization;
    let base_admin_sceret_kry = process.env.ADMIN_SCRECT_PASSWORD;

    let { category_id } = req.params;
    let {
      fs_post_name,
      fs_post_description,
      fs_post_videourl,
      fs_post_imageurl,
      fs_post_category,
      useremail,
    } = req.body;

    let maincategoryRepository = getCustomRepository(CategoryRepository);
    let parentsub_category_id = await maincategoryRepository.findOne({
      category_id: category_id,
    });
    let userRepository = getCustomRepository(UserRepository);
    let user = await userRepository.findOne({ useremail });

    let fullscreenentity = new FullScreenPostEntity();

    if (user !== undefined) {
      fullscreenentity.upload_user = user;
      if (admin_token === base_admin_sceret_kry) {
        fullscreenentity.fs_post_isapproved = "true";
      } else {
        fullscreenentity.fs_post_isapproved = "false";
      }
      fullscreenentity.fs_post_name = fs_post_name;
      fullscreenentity.fs_post_description = fs_post_description;
      fullscreenentity.fs_post_videourl = fs_post_videourl;
      fullscreenentity.fs_post_imageurl = fs_post_imageurl;
      fullscreenentity.fs_post_category = fs_post_category;
      fullscreenentity.fs_post_view = "0";
      fullscreenentity.maincategory_post = parentsub_category_id!;

      await fullscreenentity
        .save()
        .then((data: any) => {
          if (data) {
            res.send({
              code: 201,
              message: "fullscreen video added under database",
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
      res.send({
        code: 403,
        message: "user not found",
        submitted: false,
      });
    }
  }
  async fetchFullScreenPostDetailPage(req: Request, res: Response) {
    let { detail_id } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .select()
        .where("fullscreenpost.fs_post_id = :detail_id", { detail_id })
        .getOne();

      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          recivied: true,
        });
      } else {
        res.send({
          code: 301,
          data: null,
          recivied: false,
        });
      }
    } catch (error) {
      res.send({
        code: 303,
        data: "something went wrong",
        recivied: false,
      });
    }
  }

  async fetchfullscreenuserBookmark(req: Request, res: Response) {
    try {
      let { useremail } = req.params;

      var response = await this.createQueryBuilder("fullscreenpost")
        // .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("fullscreenpost.post_fs_bookmark", "bookmark")
        .leftJoin("bookmark.bookmark_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select(["fullscreenpost", "bookmark.bookmark_id"])
        .andWhere("users.useremail = :useremail", {
          useremail,
        })
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

  async fetchfullscreenuploaduserprofile(req: Request, res: Response) {
    try {
      let { fs_post_id } = req.params;

      var response = await this.createQueryBuilder("fullscreenpost")
        .leftJoin("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .andWhere("fullscreenpost.fs_post_id = :fs_post_id", {
          fs_post_id,
        })
        .getOne();
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

  async imagekitioupload(req: Request, res: Response) {
    let { filetype, imagno } = req.params;
    let myArrays: Array<any> = [];
   // const sleep = (4000) => new Promise(r => setTimeout(r, ms));
    let myArrayslist: Array<any> = [];

    let storage;
    var imagekit = new ImageKit({
      publicKey: "public_QGV75szcjUrF3X3hQJs0tJvDt7U=",
      privateKey: "private_lZW2yXVxaUU8fmbrtDChBN9jB0I=",
      urlEndpoint: "https://ik.imagekit.io/mqplbpi4l",
    });

    try {
      // //  const upload = multer({ storage: storage })

      storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "./imageupload");
        },
        filename: function (req, file, cb) {
          cb(null, "techking.jpg");
        },
      });

      switch (filetype) {
        case "fullscreenpost":
          storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, "./imageupload");
            },
            filename: function (req, file, cb) {
              cb(null, "techking.jpg");
            },
          });
          break;
        case "fullscreenpostvideo":
          storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, "./imageupload");
            },
            filename: function (req, file, cb) {
              cb(null, "techkingfvvd.mp4");
            },
          });
          break;
        case "normalvideopost":
          storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, "./imageupload");
            },
            filename: function (req, file, cb) {
              cb(null, "techkingvd.mp4");
            },
          });
          break;
        case "normalimagepost":
          storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, "./imageupload/images");
            },
            filename: function (req, file, cb) {
              cb(null, file.originalname);

              console.log(`file path ${file.originalname}`);
              //  myArrayslist.push(file.path);
            },
          });
          break;
      }

      if (filetype == "normalimagepost") {
        let upload = multer({ storage: storage }).array("images", 3);
        upload(req, res, async (err) => {
          if (err) {
            res.send({
              message: "not uploaded",
              data: null,
              code: 305,
            });
          }

          console.log(`file path ${req.files}`);

          myArrayslist.push(req.files);

          // res.send({
          //   message: "uplaod sucessfully",
          //   data: req.files,
          //   code: 201,
          // });

          //   const JSobj = JSON.parse();

          // console.log(JSobj);
          // console.log(typeof JSobj);

          const JSON_string = JSON.stringify({ myArrayslist });

          console.log(JSON_string);

          let JSobj: Root = JSON.parse(JSON_string);

          // console.log(JSobj.myArrayslist[0][0].path);

          // res.send({
          //   message: "uplaod sucessfully",
          //   data: req.files,
          //   code: 201,
          // });

          // for (let i = 0; i < JSobj.myArrayslist[0].length; i++) {
          //   // console.log("Block statement execution no." + i);

          // }

          

          if (JSobj.myArrayslist[0] !== undefined) {
            JSobj.myArrayslist[0].forEach(async (element, index, arrays) => {
              var data = JSobj.myArrayslist[0][index].path;

              console.log("final path is " + data);

              fs.readFile(
                JSobj.myArrayslist[0][index].path,
                function (err, data) {
                  if (err) throw err; // Fail if the file can't be read.
                  imagekit.upload(
                    {
                      file: data, //required
                      fileName: `${JSobj.myArrayslist[0][index].filename}`, //required
                    },
                    async function (error, result) {
                      if (error) {
                        res.send({
                          code: 306,
                          message: "file not upload",
                          data: null,
                        });
                        console.log(`aws err ${err}`);
                      } else {
                        myArrays.push(result?.url);
                        if (index === arrays.length - 1) {
                          if (result?.url != null) {
                            await new Promise(f => setTimeout(f, 2000));
                            res.send({
                              code: 201,
                              message: "file uploaded",
                              imagedatalength: req.files?.length,
                              data: myArrays,
                              recivied: true,
                            });
                          //  await sleep();
                            //   console.log("loop is closed");
                            await new Promise(f => setTimeout(f, 1000));
                            fs.rmSync("./imageupload/images", {
                              recursive: true,
                              
                            });
                            await new Promise(f => setTimeout(f, 1000));
                            console.log("done");
                            fs.access("./imageupload/images", (error) => {
   
                              // To check if the given directory 
                              // already exists or not
                              if (error) {
                                // If current directory does not exist
                                // then create it
                                fs.mkdir("./imageupload/images", (error) => {
                                  if (error) {
                                    console.log(error);
                                  } else {
                                    console.log("New Directory created successfully !!");
                                  }
                                });
                              } else {
                                console.log("Given Directory already exists !!");
                              }
                            });
                          }
                        }
                      }

                      // console.log(`aws array ${myArrays}`);
                    }
                  );
                }
              );
            });
          } else {
            res.send({
              message: "not uploaded",
              data: null,
              code: 303,
            });
          }
        });
      } else {
        const upload = multer({ storage: storage }).single("image");
        upload(req, res, (err) => {
          if (err) {
            res.send({
              message: "not uploaded",
              data: null,
              code: 302,
            });
          }
          console.log(`file path ${req.file?.path}`);

          fs.readFile(`${req.file?.path}`, function (err, data) {
            if (err) throw err; // Fail if the file can't be read.
            imagekit.upload(
              {
                file: data, //required
                fileName: `${req.file?.filename}`, //required
              },
              function (error, result) {
                if (error) {
                  res.send({
                    message: "not uploaded",
                    data: null,
                    code: 301,
                  });
                }
                //  console.log(req.file);
                res.send({
                  message: "uplaod sucessfully",
                  data: result?.url,
                  code: 201,
                });
              }
            );
          });
        });
      }
    } catch (error) {
      res.send({
        message: "not uploaded",
        data: null,
        code: 403,
      });
    }
  }

  //! fetch fullscreenpost with limit
  async fetchFullScreenPostwithlimit(req: Request, res: Response) {
    let { count } = req.params;
    const dataindex: any = count;
    // const myArrays: Array<string> = [];

    // let imgaeurl: any;
    // let s3config = new AWS.S3({
    //   accessKeyId: "AKIAYVNHSGTZMT64AQEG",
    //   secretAccessKey: "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",
    //   region: "us-east-1",
    // });
    try {
      // if (dtatesdf !== undefined) {
      //   res.send({
      //     code: 201,
      //     data: dtatesdf,
      //     recivied: true,
      //   });
      // } else {
      //   res.send({
      //     code: 302,
      //     data: null,
      //     recivied: false,
      //   });
      // }

      // let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
      //   .leftJoinAndSelect("fullscreenpost.upload_user", "users")
      //   .leftJoinAndSelect("users.info", "usersinfo")
      //   .take(dataindex)
      //   .select([
      //     "fullscreenpost",
      //     "users.id",
      //     "users.useremail",
      //     "users.username",
      //     "usersinfo.info_id",
      //     "usersinfo.profileimage",
      //   ])
      //   .getMany();
      // // function delay(ms: number) {
      // //   return new Promise((resolve) => setTimeout(resolve, ms));
      // // }

      // if (fullscreenpost !== undefined) {
      //   fullscreenpost.forEach(async (element, index, arrays) => {
      //     if (index != arrays.length) {
      //       s3config.getSignedUrl(
      //         "getObject",
      //         {
      //           Bucket:
      //             "demoawstestd2be3738946046f990b6e9e4bb74d34b82954-staging",
      //           Key: element.fs_post_imageurl,
      //           Expires: 43200,
      //         },
      //         (err, data) => {
      //           if (err) {
      //             res.send({
      //               code: 306,
      //               message: "aws not fecth",
      //               datavl: null,
      //             });
      //             console.log(`aws err ${err}`);
      //           } else {
      //             imgaeurl = element.fs_post_imageurl;
      //             console.log(`image url is ${imgaeurl}`);

      //             //  console.log(`aws url ${data}`);
      //             myArrays.push(data);
      //           }
      //           console.log(`aws array ${myArrays}`);
      //           if (index === arrays.length - 1) {
      //             console.log("loop is closed");

      //             if (index === arrays.length - 1) {
      //               res.send({
      //                 code: 201,
      //                 data: fullscreenpost,
      //                 imagedata: myArrays,
      //                 recivied: true,
      //               });
      //             }
      //           }
      //         }
      //       );
      //     }
      //   });

      //   // res.send({
      //   //   code: 201,
      //   //   data: fullscreenpost,
      //   //   imagedata: myArrays.length,
      //   //   recivied: true,
      //   // });
      // } else {
      //   res.send({
      //     code: 302,
      //     data: null,
      //     recivied: false,
      //   });
      // }

      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .take(dataindex)
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .getMany();

      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          recivied: true,
        });
      } else {
        res.send({
          code: 302,
          data: null,
          recivied: false,
        });
      }
    } catch (error) {
      res.send({
        code: 303,
        data: "something went wrong",
        recivied: false,
      });
    }
  }

  async fetchFullScreenPost(req: Request, res: Response) {
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      } else {
        res.send({
          code: 302,
          data: null,
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: "something went wrong,try again",
          received: false,
        });
      }
    }
  }
  //! approved all fullscreen posts
  async fetchFullScreenPostappall(req: Request, res: Response) {
    let { isapproved } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .where("fullscreenpost.fs_post_isapproved = :fs_post_isapproved", {
          fs_post_isapproved: isapproved,
        })
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          message: "data is available",
          received: true,
        });
      } else {
        res.send({
          code: 302,
          data: null,
          message: "data not found",
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

  //! not approved all fullscreen posts
  async fetchFullScreenPostallnotapproved(req: Request, res: Response) {
    try {
      let item;
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .where("fullscreenpost.fs_post_isapproved = :fs_post_isapproved", {
          fs_post_isapproved: "false",
        })
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      } else {
        res.send({
          code: 302,
          data: null,
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  async fetchFullScreenPostbycategoryid(req: Request, res: Response) {
    let { parent_category_id } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.maincategory_post", "category")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .andWhere("category.category_id = :parent_category_id", {
          parent_category_id,
        })
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      } else {
        res.send({
          code: 302,
          data: null,
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  async fetchdownloadsFullScreenPostbyuser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.post_fs_download", "download")
        .leftJoin("download.downloads_user", "users")
        .select(["fullscreenpost", "download.download_id"])
        .andWhere("users.useremail = :useremail", { useremail })
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      } else {
        res.send({
          code: 302,
          data: null,
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  async fetchFullScreenPostbyuser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
        .leftJoinAndSelect("users.info", "usersinfo")
        .select([
          "fullscreenpost",
          "users.id",
          "users.useremail",
          "users.username",
          "usersinfo.info_id",
          "usersinfo.profileimage",
        ])
        .where("users.useremail = :useremail", { useremail })
        .getMany();
      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      } else {
        res.send({
          code: 302,
          data: null,
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  async fetchallFullScreenPost(req: Request, res: Response) {
    try {
      let { sub_category_id, parent_category_id } = req.params;
      let fullscreenpost = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.category_post", "subcategory")
        .leftJoinAndSelect("subcategory.parent_catergory", "category")
        .select()
        .where("subcategory.sub_category_id = :sub_category_id", {
          sub_category_id,
        })
        .andWhere("category.category_id = :parent_category_id", {
          parent_category_id,
        })
        .getMany();

      if (fullscreenpost !== undefined) {
        res.send({
          code: 201,
          data: fullscreenpost,
          received: true,
        });
      }
    } catch (error) {
      if (error) {
        res.send({
          code: 402,
          data: "something went wrong,try again",
          received: false,
        });
      }
    }
  }

  //! fetch fullscreenstatus comments
  async fetchComment(req: Request, res: Response) {
    let { fs_post_id } = req.params;
    try {
      let response = await this.createQueryBuilder("fullscreenpost")
        .leftJoinAndSelect("fullscreenpost.post_fs_comment", "comment")
        .leftJoinAndSelect("fullscreenpost.upload_user", "users")
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

  async isapprovedfullscreenpost(req: Request, res: Response) {
    let { fs_post_isapproved, fs_post_id } = req.body;
    let admin_token = req.headers.authorization;
    let base_admin_sceret_kry = process.env.ADMIN_SCRECT_PASSWORD;

    if (admin_token === base_admin_sceret_kry) {
      await this.createQueryBuilder()
        .update(FullScreenPostEntity)
        .set({
          fs_post_isapproved,
        })
        .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
        .execute()
        .then((data: any) => {
          var isAffected = data.affected;

          if (isAffected > 0) {
            return res.send({
              code: 201,
              message: "updated Sucessfully",
              submitted: true,
            });
          } else {
            return res.send({
              code: 301,
              message: "not updated user not found",
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
        message: "your not admin",
        submitted: false,
      });
    }
  }

  async addviewfullscreenpost(req: Request, res: Response) {
    let { fs_post_view, fs_post_id } = req.body;

    await this.createQueryBuilder()
      .update(FullScreenPostEntity)
      .set({
        fs_post_view,
      })
      .where("fullscreenpost.fs_post_id = :fs_post_id", { fs_post_id })
      .execute()
      .then((data: any) => {
        var isAffected = data.affected;

        if (isAffected > 0) {
          return res.send({
            code: 201,
            message: "updated Sucessfully",
            submitted: true,
          });
        } else {
          return res.send({
            code: 301,
            message: "not updated user not found",
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
  }
}

import Router from "express";
import { SubCategoryController } from "../controllers/subcategory.controller";


const subcategoryRouter = Router();
//!get
subcategoryRouter.get("/", SubCategoryController.fetchsubCategory);
subcategoryRouter.get("/all/:parent_category_id", SubCategoryController.fetchallsubCategory);

//!post
subcategoryRouter.post("/addsubcategory/:category_id", SubCategoryController.submitSubCategory);

export { subcategoryRouter };

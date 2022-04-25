import Router from "express";
import { CategoryController } from "../controllers/category.controller";

const categoryRouter = Router();

//!get
categoryRouter.get("/", CategoryController.fetchCategory);
categoryRouter.get("/all/:parent_category_id", CategoryController.fetchallCategorys);


//!post
categoryRouter.post("/addcategory", CategoryController.submitCategory);

export { categoryRouter };

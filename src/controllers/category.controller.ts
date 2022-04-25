import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { CategoryRepository } from "../databases/categorys/repositroy/category.repositroy";

export class CategoryController {
  static async submitCategory(req: Request, res: Response) {
    let categoryRepository = getCustomRepository(CategoryRepository);
    await categoryRepository.submitCategory(req, res);
  }
  static async fetchCategory(req: Request, res: Response) {
    let categoryRepository = getCustomRepository(CategoryRepository);
    await categoryRepository.fetchCategory(req, res);
  }
  static async fetchallCategorys(req: Request, res: Response) {
    let categoryRepository = getCustomRepository(CategoryRepository);
    await categoryRepository.fetchallCategorys(req, res);
  }
}

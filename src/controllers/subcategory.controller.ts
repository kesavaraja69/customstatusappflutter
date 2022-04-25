import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SubCategoryRepository } from "../databases/subcategory/repository/subcategory.repository";

export class SubCategoryController {
  static async submitSubCategory(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(SubCategoryRepository);
    await subcategoryRepository.submitSubCategory(req, res);
  }

  static async fetchsubCategory(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(SubCategoryRepository);
    await subcategoryRepository.fetchsubCategory(req, res);
  }

  static async fetchallsubCategory(req: Request, res: Response) {
    let subcategoryRepository = getCustomRepository(SubCategoryRepository);
    await subcategoryRepository.fetchallsubCategory(req, res);
  }
}
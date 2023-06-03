import { Request, Response } from "express";
import prisma from "../config/dbConfig";

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    let categories = await prisma.category.findMany({
      include: { parent_category: true },
    });

    res.status(200).json(categories);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

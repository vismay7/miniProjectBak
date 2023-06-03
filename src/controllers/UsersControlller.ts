import { Request, Response } from "express";
import prisma from "../config/dbConfig";
import { UserInterface } from "../interfaces/UserInterface";
import { User, Users } from "../queries/query";
import { decodeJwt } from "../utils/getUserInfo";

// http://localhost/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ include: { Paymeny: true, Carts: true, Enrollment: true, Orders: true, _count: true } });
    res.status(200).json(users);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// http://localhost/users/info
export const getUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const userId = (decodeJwt(token as string) as UserInterface).id;
    const user = await prisma.user.findFirst({ where: { id: userId } });
    res.status(200).json(user);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { decodeJwt } from "../utils/getUserInfo";

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
  }

  try {
    const decode: any = decodeJwt(token as string);

    if (decode.is_admin === 1 || decode.is_admin === true) {
      next();
    } else {
      res.status(401).json({ message: decode.message });
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
  }
  try {
    const decode: any = decodeJwt(token as string);

    if (decode.is_admin === 0 || decode.is_admin === false || decode.is_admin === 1 || decode.is_admin === true) {
      next();
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

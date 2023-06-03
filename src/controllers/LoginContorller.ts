import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign, SignOptions } from "jsonwebtoken";
import { generateOTP, verification } from "../utils/otp";
import prisma from "../config/dbConfig";
import { otpVerificationMail } from "../utils/email";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({ where: { email: email } });
    const loginCheckPass = await bcrypt.compare(password, user?.password!);

    if (!loginCheckPass) {
      throw new Error("password is not valid");
    }

    const signInOptions: SignOptions = {
      expiresIn: "1h",
    };

    const token = sign(user!, process.env.JWT_SECRET!, signInOptions);
    res.status(200).json({ messge: "Login Successful", token: `Bearer ${token}` });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    let { email, fullname, password } = req.body;
    password = await bcrypt.hash(password, 10);

    const signUpUser = await prisma.user.create({ data: { email: email, fullname: fullname, password: password } });
    const otp = await generateOTP(signUpUser?.email!);
    await otpVerificationMail(email, otp);

    res.status(200).json(signUpUser);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const verified = await verification(otp, email);
    if (verified) {
      res.status(200).json({ message: "User has been verified" });
    } else {
      throw new Error("Invalid Otp");
    }
  } catch (error) {
    const err = error as Error;
    res.status(400).json(err.message);
  }
};

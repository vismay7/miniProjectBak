import { Router } from "express";
import { login, signUp, verifyOtp } from "../controllers/LoginContorller";

const loginRouter = Router();

// GET /login
loginRouter.post("/login", login);

// POST /sign
loginRouter.post("/sign-up", signUp);

//POST /verfiy-otp
loginRouter.post("/verfiy-otp", verifyOtp);

export default loginRouter;

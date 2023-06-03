import { Router } from "express";
import { login, resendOtp, signUp, verifyOtp } from "../controllers/LoginContorller";

const loginRouter = Router();

// GET /login
loginRouter.post("/login", login);

// POST /sign
loginRouter.post("/sign-up", signUp);

//POST /verfiy-otp
loginRouter.post("/verfiy-otp", verifyOtp);

//POST resend otp
loginRouter.post("/resend-otp", resendOtp);

export default loginRouter;

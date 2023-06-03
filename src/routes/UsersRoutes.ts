import { Router } from "express";
import { getAllUsers, getUser } from "../controllers/UsersControlller";
import { verifyAdmin, verifyUser } from "../middleware/verfiyUser";

const usersRoutes = Router();

usersRoutes.get("/", getAllUsers);
usersRoutes.get("/info", getUser);

export default usersRoutes;

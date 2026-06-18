import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const router = new Router();

router.route("/register").post(userController.create);
router.route("/").get(userController.getAllUsers);



export default router
import { userService } from "../services/user.services.js";

class UserController {

    /* 
    *   @param req
    *   @param res
    *   @returns json
    */
    async create(req, res) {
        const user = await userService.createUser(req, res);
        return res.status(201).json({
            success: true,
            data: user,
            message: "User created successfully"
        })
    }

    /* 
    *   @param req
    *   @param res
    *   @returns json
    */
    async getAllUsers(req, res) {
        const users = await userService.getAllUsers(req, res);
        return res.status(200).json({
            success: true,
            data: users,
            message: "Users fetched successfully"
        });
    }
}

const userController = new UserController();
export { userController };

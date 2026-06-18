import { userRepository } from "../repositories/user.repository.js";

class UserService {
    async createUser(req, res) {
        const user = req.body;
        if (!user || user.name === "" || user.email === "" || user.password === "") {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const createdUser = await userRepository.findByEmail(user.email);
        if (createdUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }
        return userRepository.createUser(user);
    }

    async getAllUsers() {
        return userRepository.getAllUsers();
    }
}

const userService = new UserService();
export { userService };
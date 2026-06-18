import { User } from "../model/user.model.js";

class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async createUser(user) {
       return await this.userModel.create(user);
    }
    async findByEmail(email) {
        return  await this.userModel.findOne({ email: email });
    }

    async getAllUsers() {
        return await this.userModel.find();
    }
}

const userRepository = new UserRepository(User);
export { userRepository };
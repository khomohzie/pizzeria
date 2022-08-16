import User from "../models/user.model";
import { comparePassword } from "../utils/auth.util";

class UserService {
	#user;

	async authenticate(email, password) {
		this.#user = await User.findOne({ email }).exec();

		if (!this.#user) return false;

		const matchPassword = await comparePassword(
			password,
			this.#user.password
		);

		if (!matchPassword) return false;

		delete this.#user.password;

		return this.#user;
	}

	async getByEmail(email) {
		this.#user = await User.findOne({ email }).exec();

		delete this.#user.password;

		return this.#user;
	}

	async getById(id) {
		this.#user = await User.findById(id).exec();

		delete this.#user.password;

		return this.#user;
	}
}

export default UserService;

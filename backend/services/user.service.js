const UserModel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/auth.util");
const jwt = require("jsonwebtoken");

class User {
	//* This class will be overriden in subclasses
	async register() {
		return true;
	}

	async authenticate(email, password) {
		this.user = await UserModel.findOne({ email }).exec();

		if (!this.user) return false;

		const matchPassword = await comparePassword(
			password,
			this.user.password
		);

		if (!matchPassword) return false;

		delete this.user.password;

		return this.user;
	}

	async getByEmail(email) {
		this.user = await UserModel.findOne({ email }).exec();

		delete this.user.password;

		return this.user;
	}

	async getById(id) {
		this.user = await UserModel.findById(id).exec();

		delete this.user.password;

		return this.user;
	}

	async generateJwtToken(payload) {
		return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
	}

	async checkExists(model, value) {
		this.user = await model
			.findOne({ $or: [{ email: value }, { username: value }] })
			.exec();

		if (this.user) {
			return true;
		}

		return false;
	}
}

module.exports = User;

const userModel = require("../models/user.model");
const User = require("../models/user.model");
const UserClass = require("../services/user.service");
const { hashPassword } = require("../utils/auth.util");

class Admin extends UserClass {
	constructor(user) {
		super(user);

		this.errors = [];
		this.data = user;
	}

	async register(fullname, email, password, username) {
		const allowedAdmins = ["khomohzie@gmail.com"];

		if (allowedAdmins.indexOf(email) === -1)
			return [false, "You cannot register as an admin!"];

		const [valStatus, errors] = await this.validate({
			fullname,
			email,
			password,
			username,
		});

		if (!valStatus) return [false, errors];

		const hashedPassword = await hashPassword(password);

		this.user = new User({
			fullname,
			email,
			password: hashedPassword,
			username,
			role: 0,
		});

		this.data = await this.user.save();

		return [true, this.data];
	}

	async deleteOtherUsers(email) {
		this.user = await this.checkExists(userModel, email);

		if (!this.user) return [false, "User not found"];

		await userModel.findOneAndDelete({ email }).exec();

		return [true, "User deleted"];
	}
}

module.exports = Admin;

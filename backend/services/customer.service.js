const User = require("../models/user.model");
const UserClass = require("../services/user.service");
const { hashPassword } = require("../utils/auth.util");

class Customer extends UserClass {
	constructor(user) {
		super(user);

		this.errors = [];
		this.data = user;
	}

	async register(fullname, email, password, username, contact) {
		const [valStatus, errors] = await this.validate({
			fullname,
			email,
			password,
			username,
			contact,
		});

		if (!valStatus) return [false, errors];

		const hashedPassword = await hashPassword(password);

		this.user = new User({
			fullname,
			email,
			password: hashedPassword,
			username,
			contact,
		});

		this.data = await this.user.save();

		return [true, this.data];
	}
}

module.exports = Customer;

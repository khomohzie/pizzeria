const User = require("../models/user.model");
const UserClass = require("../services/user.service");
const { hashPassword } = require("../utils/auth.util");
const { translateError } = require("../utils/mongo_helper");

class Admin extends UserClass {
	constructor(user) {
		super(user);

		this.errors = [];
		this.data = user;
	}

	async register(fullname, email, password, username) {
		this.errors = [];

		const allowedAdmins = ["khomohzie@gmail.com"];

		if (allowedAdmins.indexOf(email) === -1)
			this.errors.push("You cannot register as an admin!");
		if (await this.checkExists(User, email))
			this.errors.push("email exists!");
		if (await this.checkExists(User, username))
			this.errors.push("username exists!");

		if (this.errors.length > 0) return [false, this.errors];

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

	async editProfile(id, data) {
		this.errors = [];

		if (data.username) {
			const usernameTaken = await this.checkExists(User, data.username);

			if (usernameTaken) this.errors.push("username is taken!");
		}

		this.user = await this.getById(id);

		if (!this.user) this.errors.push("Admin does not exist");

		// Make sure nobody can change password/pin illegally so store them temporarily
		const userPassword = this.user.password;
		const userResetPin = this.user.reset_password_pin;
		const userEmail = this.user.email;

		// Check for fields with new value and assign to the user document for update
		for (const field in data) {
			this.user[field] = data[field];
		}

		// Now if someone entered a new password/pin illegally, revert to old password/pin
		this.user.password = userPassword;
		this.user.reset_password_pin = userResetPin;
		this.user.email = userEmail;

		User.updateOne({ _id: id }, this.user, {
			$new: true,
		}).exec((err, success) => {
			if (err) this.errors.push(translateError(err));
		});

		if (this.errors.length > 0) return [false, this.errors];

		return [true, this.user];
	}
}

module.exports = Admin;

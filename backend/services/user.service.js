const UserModel = require("../models/user.model");
const { comparePassword, hashPassword } = require("../utils/auth.util");
const jwt = require("jsonwebtoken");
const Common = require("./common.service");

class User extends Common {
	constructor(common) {
		super(common);

		this.errors = [];
	}

	#user;

	//* This class will be overriden in subclasses
	async register() {
		return true;
	}

	async authenticate(email, password) {
		this.#user = await UserModel.findOne({ email }).exec();

		if (!this.#user) {
			return [
				false,
				"User with that email does not exist! Please signup!",
			];
		}

		const matchPassword = await comparePassword(
			password,
			this.#user.password
		);

		if (!matchPassword) return [false, "Wrong password"];

		this.#user.password = undefined;

		const token = this.#generateJwtToken({ _id: this.#user._id });

		return [true, { token, user: this.#user }];
	}

	async #getByEmailUsername(userId) {
		this.#user = await UserModel.findOne({
			$or: [{ email: userId }, { username: userId }],
		}).exec();

		if (this.#user) {
			this.#user.password = undefined;

			return this.#user;
		}

		return false;
	}

	#generateJwtToken(payload) {
		return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
	}

	async checkExists(model, value) {
		this.#user = await model
			.findOne({ $or: [{ email: value }, { username: value }] })
			.exec();

		if (this.#user) {
			return true;
		}

		return false;
	}

	async update(id, data) {
		this.errors = [];

		if (data.username) {
			const usernameTaken = await this.checkExists(
				UserModel,
				data.username
			);

			if (usernameTaken) this.errors.push("username is taken!");
		}

		this.#user = await this.getById(UserModel, id);

		if (!this.#user) this.errors.push("No such user");

		// Make sure nobody can change password/pin illegally so store them temporarily
		const userPassword = this.#user.password;
		const userResetPin = this.#user.reset_password_pin;
		const userEmail = this.#user.email;
		const userRole = this.#user.role;

		// Check for fields with new value and assign to the user document for update
		for (const field in data) {
			this.#user[field] = data[field];
		}

		// Now if someone entered a new password/pin illegally, revert to old password/pin
		this.#user.password = userPassword;
		this.#user.reset_password_pin = userResetPin;
		this.#user.email = userEmail;
		this.#user.role = userRole;

		UserModel.updateOne({ _id: id }, this.#user, {
			$new: true,
		}).exec((err, success) => {
			if (err) this.errors.push(translateError(err));
		});

		if (this.errors.length > 0) return [false, this.errors];

		this.#user.password = undefined;

		return [true, this.#user];
	}

	async validate(obj) {
		this.errors = [];

		for (const property in obj) {
			if (obj[property] === "") {
				this.errors.push(`${property} should not be empty`);
			}
		}

		if (await this.checkExists(UserModel, obj.email))
			this.errors.push("email exists!");
		if (await this.checkExists(UserModel, obj.username))
			this.errors.push("username exists!");

		if (obj.password.length < 6) {
			this.errors.push("Password should have at least 6 characters");
		}

		return this.errors.length > 0 ? [false, this.errors] : [true, []];
	}

	async forgot(userId) {
		this.#user = await this.#getByEmailUsername(userId);

		if (!this.#user) return [false, "User not found! Please signup"];

		// credentials to reset password
		const resetPin = Math.floor(100000 + Math.random() * 900000);
		const pinExpiry = new Date().getTime() + 10 * 60000;

		const update = await UserModel.updateOne(
			{ _id: this.#user._id },
			{ reset_password_pin: resetPin, reset_pin_expiry: pinExpiry }
		).exec();

		if (update.acknowledged === true && update.modifiedCount === 1) {
			return [true, { resetPin, user: this.#user }];
		}

		return [false, "User not updated!"];
	}

	async reset(resetPin, password) {
		this.#user = await UserModel.findOne({
			reset_password_pin: resetPin,
		}).exec();

		if (!this.#user) return [false, "Incorrect pin!"];

		const currentTime = new Date().getTime();

		if (currentTime > this.#user.reset_pin_expiry) {
			return [false, "Expired pin!"];
		}

		const hashedPassword = await hashPassword(password);

		const update = await UserModel.updateOne(
			{ _id: this.#user._id },
			{
				password: hashedPassword,
				reset_password_pin: "",
				reset_pin_expiry: "",
			}
		).exec();

		if (update.acknowledged === true && update.modifiedCount === 1) {
			return [true, "Password changed successfully."];
		}

		return [false, "Failed to update!"];
	}

	async changePassword(id, oldPassword, newPassword) {
		this.#user = await this.getById(UserModel, id);

		if (!this.#user) return [false, "Please signin!"];

		if (!(await comparePassword(oldPassword, this.#user.password)))
			return [false, "Old password is incorrect!"];

		const hashedPassword = await hashPassword(newPassword);

		const update = await UserModel.updateOne(
			{ _id: this.#user._id },
			{
				password: hashedPassword,
			}
		).exec();

		if (update.acknowledged === true && update.modifiedCount === 1) {
			return [true, "Password changed successfully."];
		}

		return [false, "Failed to update!"];
	}

	async deleteMe(id) {
		this.#user = await this.getById(UserModel, id);

		if (!this.#user) return [false, "User not found!"];

		await this.delete(UserModel, id);

		return [true, "Account deleted successfully"];
	}

	async getMe(id) {
		this.#user = await this.getById(UserModel, id);

		if (!this.#user) return [false, "User not found!"];

		this.#user.password = undefined;

		return [true, this.#user];
	}
}

module.exports = User;

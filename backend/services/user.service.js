const UserModel = require("../models/user.model");
const { comparePassword } = require("../utils/auth.util");
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

	async getByEmail(email) {
		this.#user = await UserModel.findOne({ email }).exec();

		delete this.#user.password;

		return this.#user;
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

		this.#user.password = undefined;

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
}

module.exports = User;

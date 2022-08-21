const User = require("../models/user.model");
const Favorite = require("../models/favorite.model");
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

	async favoritePizza(user, pizza) {
		if (!user) return [false, "User ID is required"];
		if (!pizza) return [false, "Pizza ID is required"];

		this.data = new Favorite({
			user,
			pizza,
		});

		return [true, await this.data.save()];
	}

	async getFavourites(user) {
		this.data = await Favorite.find({ user }).populate("pizza").exec();

		if (this.data.length <= 0) return [false, "No favorite pizza"];

		return [true, this.data];
	}

	async removeFavorite(user, pizza) {
		this.data = await Favorite.findOne({ user, pizza })
			.populate("pizza")
			.exec();

		if (!this.data) return [false, "Not found"];

		await Favorite.findOneAndDelete({ user, pizza }).exec();

		return [true, `${this.data.pizza.name} removed from favorites`];
	}
}

module.exports = Customer;

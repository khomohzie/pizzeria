const pizzaModel = require("../models/pizza.model");
const Common = require("./common.service");
const cloudinaryUpload = require("../utils/cloudinary");

class Pizza extends Common {
	constructor(pizza) {
		super(pizza);

		this.data = pizza;
	}

	#pizza;

	async addPizza(name, description, price, image) {
		const [valStatus, errors] = this.validate({
			name,
			description,
			price,
		});

		if (!valStatus) return [false, errors];

		let pizzaImage;

		if (image) {
			await cloudinaryUpload(image.path).then(
				(downloadURL) => {
					pizzaImage = downloadURL;
				},
				(error) => {
					console.error("CLOUDINARY ERROR ==>", error);
				}
			);
		}

		this.#pizza = new pizzaModel({
			name,
			description,
			price,
			image: pizzaImage,
		});

		this.data = await this.#pizza.save();

		return [true, this.data];
	}

	async getAllPizzas() {
		this.data = await this.getAll(pizzaModel);

		if (this.data.length <= 0) return [false, "No pizza found"];

		return [true, this.data];
	}

	async getMe(id) {
		this.#pizza = await this.getById(pizzaModel, id);

		if (!this.#pizza) return [false, "Pizza not found!"];

		return [true, this.#pizza];
	}

	async update(id, data, image) {
		this.errors = [];

		this.#pizza = await this.getById(pizzaModel, id);

		if (!this.#pizza) this.errors.push("No such pizza");

		// Upload image to cloudinary
		if (image) {
			await cloudinaryUpload(image.path).then(
				(downloadURL) => {
					this.#pizza.image = downloadURL;
				},
				(error) => {
					console.error("CLOUDINARY ERROR ==>", error);
				}
			);
		}

		// Check for fields with new value and assign to the user document for update
		for (const field in data) {
			this.#pizza[field] = data[field];
		}

		pizzaModel
			.updateOne({ _id: id }, this.#pizza, {
				$new: true,
			})
			.exec((err, success) => {
				if (err) this.errors.push(translateError(err));
			});

		if (this.errors.length > 0) return [false, this.errors];

		return [true, this.#pizza];
	}

	async deleteMe(id) {
		this.#pizza = await this.getById(pizzaModel, id);

		if (!this.#pizza) return [false, "Pizza not found!"];

		await this.delete(pizzaModel, id);

		return [true, "Pizza remmoved successfully"];
	}

	validate(obj) {
		this.errors = [];

		for (const property in obj) {
			if (obj[property] === "") {
				this.errors.push(`${property} should not be empty`);
			}
		}

		return this.errors.length > 0 ? [false, this.errors] : [true, []];
	}
}

module.exports = Pizza;

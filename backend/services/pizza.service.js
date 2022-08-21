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

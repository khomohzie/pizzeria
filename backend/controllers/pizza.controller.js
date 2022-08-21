const Pizza = require("../services/pizza.service");
const CustomResponse = require("../utils/response.util");

const pizza = new Pizza();

exports.createPizza = async (req, res) => {
	try {
		const fields = JSON.parse(req.fields.data);
		const { name, description, price } = fields;
		const { image } = req.files;

		const [status, data] = await pizza.addPizza(
			name,
			description,
			price,
			image
		);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to save pizza!",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"Pizza saved successfully",
			data,
			200
		);
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};

exports.getPizza = async (req, res) => {
	try {
		const [status, data] = await pizza.getMe(req.params.id);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to retrieve pizza!",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"Pizza retrieved successfully",
			data,
			200
		);
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};

exports.getAllPizzas = async (req, res) => {
	try {
		const [status, data] = await pizza.getAllPizzas();

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to retrieve pizzas!",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"Pizzas retrieved successfully",
			data,
			200
		);
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};

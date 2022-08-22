const Customer = require("../../services/customer.service");
const User = require("../../services/user.service");
const CustomResponse = require("../../utils/response.util");

const user = new User();
const customer = new Customer();

exports.userProfile = async (req, res) => {
	try {
		const [status, data] = await user.getMe(req.user._id);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to retrieve user profile!",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"User retrieved successfully",
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

exports.editProfile = async (req, res) => {
	try {
		const fields = req.body;

		const [status, data] = await user.update(req.user._id, fields);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to update user!",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"User updated successfully",
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

exports.changePassword = async (req, res) => {
	try {
		const { oldPassword, newPassword } = req.body;

		const [status, data] = await user.changePassword(
			req.user._id,
			oldPassword,
			newPassword
		);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Password update failed!",
				data,
				400
			);
		}

		return new CustomResponse(res).success("Successful", data, 200);
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Something went wrong! Please try again." });
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		const [status, data] = await user.deleteMe(req.user._id);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to delete user!",
				data,
				400
			);
		}

		return new CustomResponse(res).success("Success!", data, 200);
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};

exports.favoritePizza = async (req, res) => {
	try {
		const [status, data] = await customer.favoritePizza(
			req.user._id,
			req.body.pizza
		);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to save pizza!",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"Pizza saved to favorites!",
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

exports.getFavorites = async (req, res) => {
	try {
		const [status, data] = await customer.getFavourites(req.user._id);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to retrieve favorites",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"Favorite pizzas retrieved",
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

exports.deleteFavorites = async (req, res) => {
	try {
		const [status, data] = await customer.removeFavorite(
			req.user._id,
			req.body.pizza
		);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to remove from favorites",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"Pizza removed from favorites",
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

const Customer = require("../../services/customer.service");
const User = require("../../services/user.service");
const CustomResponse = require("../../utils/response.util");

const user = new User();
const customer = new Customer();

exports.editProfile = async (req, res) => {
	try {
		const fields = req.body;

		const [status, data] = await customer.editProfile(
			req.params.id,
			fields
		);

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

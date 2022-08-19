const Customer = require("../../services/customer.service");
const User = require("../../services/user.service");
const CustomResponse = require("../../utils/response.util");

const user = new User();
const customer = new Customer();

exports.createUser = async (req, res) => {
	try {
		const { fullname, email, password, username, contact } = req.body;

		const [status, data] = await customer.register(
			fullname,
			email,
			password,
			username,
			contact
		);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to create user!",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"User created successfully",
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

const Admin = require("../../services/admin.service");
const User = require("../../services/user.service");
const CustomResponse = require("../../utils/response.util");

const user = new User();
const admin = new Admin();

exports.createAdmin = async (req, res) => {
	try {
		const { fullname, email, password, username } = req.body;

		const [status, data] = await admin.register(
			fullname,
			email,
			password,
			username
		);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to create admin!",
				data,
				400
			);
		}

		return new CustomResponse(res).success(
			"Admin created successfully",
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

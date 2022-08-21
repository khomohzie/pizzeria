const Admin = require("../../services/admin.service");
const User = require("../../services/user.service");
const CustomResponse = require("../../utils/response.util");

const admin = new Admin();

exports.deleteUser = async (req, res) => {
	try {
		const [status, data] = await admin.deleteOtherUsers(req.body.email);

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

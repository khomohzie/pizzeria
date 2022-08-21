import User from "../models/user.model";

async function isAdmin(req, res, next) {
	try {
		const admin = await User.findById(req.user._id);

		if (!admin) {
			return new CustomResponse(res, true).error(
				"This user does not exist",
				{},
				400
			);
		}

		if (admin.role !== 0) {
			return new CustomResponse(res, true).error(
				"Access denied, only admins can perform this operation.",
				{},
				403
			);
		}

		next();
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Invalid token maybe.",
			error.message,
			400
		);
	}
}

module.exports = isAdmin;

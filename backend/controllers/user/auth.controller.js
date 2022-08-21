const Common = require("../../services/common.service");
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
			return new CustomResponse(res, true).error(
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

exports.signin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const [status, data] = await user.authenticate(email, password);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Failed to authenticate user!",
				data,
				400
			);
		}

		res.cookie("token", data.token, { expiresIn: "1d" });

		return new CustomResponse(res).success(
			"User authenticated successfully",
			{ token: data.token, user: data.user },
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

exports.forgotPassword = async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return new CustomResponse(res, true).error(
				"Email or username is required",
				{},
				400
			);
		}

		const [status, data] = await user.forgot(userId);

		if (!status) {
			return new CustomResponse(res, true).error(
				"Failed! Please try again",
				data,
				400
			);
		}

		const msg = {
			email: data.user.email,
			subject: "Reset your password",
			html: `
				<h1>Pizzeria</h1>
				<p>Please use the following pin to reset your password.
				<br/>The pin expires in 10 minutes.</p>
				<h2 style="text-align: center">${data.resetPin}</h2>
				<p>You can use the link below to go directly to the reset password page.</p>
				<a>${process.env.CLIENT_URL}/auth/reset</a>
				<hr />
				<footer>This email may contain sensitive information</footer>
			`,
		};

		Common.sendMail(msg, (status, info) => {
			if (!status) {
				return new CustomResponse(res, true).error(
					"Failed to send mail",
					info,
					400
				);
			}

			return new CustomResponse(res).success("Success!", info, 200);
		});
	} catch (error) {
		console.log(error);
		return new CustomResponse(res, error).error(
			"Something went wrong",
			error,
			500
		);
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { resetPin, password } = req.body;

		const [status, data] = await user.reset(resetPin, password);

		if (!status) {
			return new CustomResponse(res, status).error(
				"Password reset failed!",
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

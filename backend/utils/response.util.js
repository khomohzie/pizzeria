/**
 * @description Response handler
 */

class CustomResponse {
	constructor(res, err = false) {
		this.res = res;
		this.exception = err || new Error();
	}

	// Send success response with status code and data
	success(message = "", data = {}, statusCode = 200, meta = {}) {
		return this.res.status(statusCode || 200).json({
			success: true,
			code: statusCode || 200,
			message,
			data,
			meta,
		});
	}

	// Send error response with status code and error message
	error(message = "", data = {}, statusCode = 500, meta = {}) {
		return this.res.status(statusCode || 500).json({
			success: false,
			code: statusCode,
			message: message,
			data,
			meta,
		});
	}
}

module.exports = CustomResponse;

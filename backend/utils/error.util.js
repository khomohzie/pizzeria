/**
 * @description Custom error class extends the JavaScript Error class
 * @param {string | string[]} message
 * @param {number} statusCode
 * @param {object} meta
 */

class CustomException extends Error {
	constructor(statusCode = 500, message, meta = {}) {
		super(message);

		this.name = "CustomException";
		this.message = message;
		this.status = statusCode;
		this.meta = meta;
		this.stack = new Error().stack;
		this.date = new Date().toString();
	}
}

export default CustomException;

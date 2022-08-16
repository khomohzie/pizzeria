import bcrypt from "bcrypt";

/**
 * Function to hash the plain password submitted by users during registration
 * before storing in the database.
 * return JavaScript Promise; resolve for success, reject for failure.
 */
export const hashPassword = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(12, (err, salt) => {
			if (err) {
				reject(err);
			}

			bcrypt.hash(password, salt, (err, hash) => {
				if (err) {
					reject(err);
				}

				resolve(hash);
			});
		});
	});
};

/**
 * Function to compare password received during login
 * to the hashed password in the database.
 * Use bcrypt's compare method to compare the passwords.
 */
export const comparePassword = (password, hashedPassword) => {
	return bcrypt.compare(password, hashedPassword);
};

// Importing necessary modules from Express Validator
import { matchedData, validationResult } from 'express-validator';

/**
 * Middleware for validating form data using Express Validator
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Response object with validation status and error messages
 */
async function validateFormData(req, res, next) {
	// Get validation errors, if any
	let validation = validationResult(req);

	// Check if there are validation errors
	if (!validation.isEmpty()) {
		let errorMsgs = [];

		// Iterate through validation errors and build error messages
		validation.errors.forEach((error) => {
			let fieldName = error.param;
			let message = error.msg.toString();
			errorMsgs.push(`${fieldName}: ${message}`);
		});

		// Return a response with validation error details
		return res.badRequest({
			Status: 'Failed',
			Message: `Request body validation error`,
			Errors: errorMsgs,
		});
	}

	// Attach a function to the request object to retrieve validated form data
	req.getValidFormData = function (options = { includeOptionals: false }) {
		return matchedData(req, { locations: ['body'], ...options });
	};

	// Proceed to the next middleware in the pipeline
	return next();
}

// Exporting the validateFormData middleware as the default export
export default validateFormData;

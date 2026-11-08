"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePositiveIntegerParam = validatePositiveIntegerParam;
const inputValidation_1 = require("../security/inputValidation");
const responseHandler_1 = require("../utils/responseHandler");
function validatePositiveIntegerParam(_request, response, next, value, name) {
    try {
        (0, inputValidation_1.parsePositiveInteger)(value, name);
        next();
    }
    catch (error) {
        if (error instanceof inputValidation_1.InputValidationError) {
            response.status(400).json((0, responseHandler_1.errorHandler)(400, error.message));
            return;
        }
        next(error);
    }
}

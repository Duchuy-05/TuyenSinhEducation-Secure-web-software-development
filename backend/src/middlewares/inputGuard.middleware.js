"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputGuard = inputGuard;
const inputValidation_1 = require("../security/inputValidation");
const responseHandler_1 = require("../utils/responseHandler");
function inputGuard(request, response, next) {
    try {
        (0, inputValidation_1.assertSafeInput)(request.body, 'body');
        (0, inputValidation_1.assertSafeInput)(request.query, 'query');
        (0, inputValidation_1.assertSafeInput)(request.params, 'params');
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

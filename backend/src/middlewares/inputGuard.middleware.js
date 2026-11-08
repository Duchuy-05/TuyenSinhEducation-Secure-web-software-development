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
        if (request.query.page !== undefined || request.query.limit !== undefined) {
            (0, inputValidation_1.parsePagination)(request.query.page, request.query.limit);
        }
        for (const source of [request.body, request.query, request.params]) {
            if (!source || typeof source !== 'object' || Array.isArray(source))
                continue;
            for (const field of ['classId', 'courseId', 'teacherId', 'userId']) {
                if (source[field] !== undefined) {
                    (0, inputValidation_1.parsePositiveInteger)(source[field], field);
                }
            }
        }
        if (request.body?.userIds !== undefined) {
            if (!Array.isArray(request.body.userIds) || request.body.userIds.length === 0 || request.body.userIds.length > 100) {
                throw new inputValidation_1.InputValidationError('userIds phải là danh sách từ 1 đến 100 ID');
            }
            request.body.userIds.forEach((value) => (0, inputValidation_1.parsePositiveInteger)(value, 'userIds'));
        }
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.successHandler = void 0;
const successHandler = (status, message, data = null) => {
    return {
        status,
        message,
        data
    };
};
exports.successHandler = successHandler;
const errorHandler = (status, message) => {
    return {
        status,
        message,
    };
};
exports.errorHandler = errorHandler;

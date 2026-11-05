import { NextFunction, Request, Response } from 'express';
import { assertSafeInput, InputValidationError } from '../security/inputValidation';
import { errorHandler } from '../utils/responseHandler';

export function inputGuard(request: Request, response: Response, next: NextFunction): void {
  try {
    assertSafeInput(request.body, 'body');
    assertSafeInput(request.query, 'query');
    assertSafeInput(request.params, 'params');
    next();
  } catch (error) {
    if (error instanceof InputValidationError) {
      response.status(400).json(errorHandler(400, error.message));
      return;
    }
    next(error);
  }
}

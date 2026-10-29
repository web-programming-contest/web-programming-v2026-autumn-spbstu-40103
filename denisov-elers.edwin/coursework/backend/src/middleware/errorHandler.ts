import type {ErrorRequestHandler} from 'express';
import {OrderRequestError} from '../domain/order.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const isInvalidJson = error instanceof SyntaxError;
  const status =
    error instanceof OrderRequestError || isInvalidJson ? 400 : 500;

  if (!(error instanceof OrderRequestError)) {
    console.error(error);
  }

  const message =
    error instanceof OrderRequestError
      ? error.message
      : isInvalidJson
        ? 'Некорректный JSON'
        : 'Ошибка сервера. Попробуйте позже';

  res.status(status).json({message});
};

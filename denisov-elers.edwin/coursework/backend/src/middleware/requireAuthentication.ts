import type {RequestHandler} from 'express';

export const requireAuthentication: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    res.status(401).json({message: 'Войдите в аккаунт'});
    return;
  }

  next();
};

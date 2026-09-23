import {Router} from 'express';
import type {JsonStorage} from '../data/jsonStorage.js';

interface User {
  id: string;
  login: string;
  password: string;
}

export function createAuthRouter(storage: JsonStorage) {
  // eslint-disable-next-line new-cap
  const router = Router();

  router.get('/session', (req, res) => {
    res.json({authenticated: Boolean(req.session.userId)});
  });

  router.post('/login', async (req, res, next) => {
    try {
      const users = await storage.read<User[]>('users.json');
      const user = users.find(
        (candidate) =>
          candidate.login === req.body?.login &&
          candidate.password === req.body?.password,
      );

      if (!user) {
        res.status(401).json({
          message:
            'такого пользователя нет, возможно неправильный логин или пароль - проверьте данные',
        });
        return;
      }

      req.session.regenerate((error) => {
        if (error) {
          return next(error);
        }

        req.session.userId = user.id;
        req.session.save((saveError) =>
          saveError ? next(saveError) : res.json({authenticated: true}),
        );
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/logout', (req, res, next) => {
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }
      res.clearCookie('connect.sid').json({authenticated: false});
    });
  });

  return router;
}

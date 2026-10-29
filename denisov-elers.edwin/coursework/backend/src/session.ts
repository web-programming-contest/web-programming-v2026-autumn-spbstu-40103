import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export function createSessionMiddleware() {
  return session({
    secret: process.env.SESSION_SECRET || 'gadget-hub-local-classroom-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true, sameSite: 'lax', maxAge: 86400000},
  });
}

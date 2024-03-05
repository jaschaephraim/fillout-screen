import { NextFunction, Request, Response } from 'express';

// Responds with JSON error and given status code, or 500 by default
export default function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);

    const status = err.status ?? 500;
    res.status(status).json({ error: err.message });
    return;
  }
  next();
}

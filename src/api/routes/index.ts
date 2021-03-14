import { Router, Request, Response } from 'express';

import createError from 'http-errors';

import { UserRequest } from '../models/UserRequest';

// Middleware
import auth from '../middlewares/auth';

// Child router
import jenisRouter from './jenis';
import kainRouter from './kain';
import kategoriRouter from './kategori';
import logRouter from './log';
import tipeRouter from './tipe';

const router = Router();

// GET `/api`
router.get('/', (req: Request, res: Response) => {
  return res.redirect('/');
});

// Child route url
router.use('/jenis', jenisRouter);
router.use('/kain', kainRouter);
router.use('/kategori', kategoriRouter);
router.use('/log', logRouter);
router.use('/tipe', tipeRouter);

// POST `/api/login`
router.post('/login', auth.loginModule, (req: UserRequest, res: Response, next) => {
  return res.status(200).json({
    info: '😚 200 - Login API :: Berhasil Login Yeay 🤩',
    result: {
      token: req.user.session_token
    }
  });
});

// Catch 404 and forward to error handler
router.use((req: Request, res: Response, next) => {
  return next(createError(404));
});

// Error handler
router.use((err: any, req: Request, res: Response, next) => {
  res.locals.message = err.message;
  res.locals.error = err;
  return res.status(err.status || 500).json({
    info: `😫 ${err.status || 500} - Error API :: Whoops Terjadi Kesalahan 💩`,
    result: err
  });
});

export default router;

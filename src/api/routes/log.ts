import { Router, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { UserRequest } from '../models/UserRequest';

import { Log } from '../entities/Log';

const router = Router();

// GET `/api/log`
router.get('/', async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const logRepo = getRepository(Log);
    const [log, count] = await logRepo.findAndCount({
      order: {
        ...((req.query.sort && req.query.order) ? {
          [req.query.sort]: req.query.order.toUpperCase()
        } : {
          created_at: 'DESC'
        })
      },
      skip: req.query.page > 0 ? (req.query.page * req.query.row - req.query.row) : 0,
      take: (req.query.row > 0 && req.query.row <= 500) ? req.query.row : 10
    });
    return res.status(200).json({
      info: `😅 200 - Log API :: List All 🤣`,
      count,
      pages: Math.ceil(count / (req.query.row ? req.query.row : 10)),
      results: log
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: `🙄 400 - Log API :: Gagal Mendapatkan All Log 😪`,
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
});

export default router;

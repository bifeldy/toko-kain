import createError from 'http-errors';

import { Router, Response, NextFunction } from 'express';
import { getRepository, Equal } from 'typeorm';

import { UserRequest } from '../models/UserRequest';

import { Role } from '../../app/_shared/models/Role';

import { Jenis } from '../entities/Jenis';

// Middleware
import auth from '../middlewares/auth';

const router = Router();

// GET `/api/jenis`
router.get('/', async (req: UserRequest, res: Response, next: NextFunction) => {
  const jenisRepo = getRepository(Jenis);
  const [jeniss, count] = await jenisRepo.findAndCount({
    order: {
      name: 'ASC'
    }
  });
  return res.status(200).json({
    info: `😅 200 - Jenis API :: List All 🤣`,
    count,
    pages: 1,
    results: jeniss
  });
});

// POST `/api/jenis`
router.post('/', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      if ('name' in req.body) {
        const jenisRepo = getRepository(Jenis);
        const jenis = new Jenis();
        jenis.name = req.body.name;
        const resJenisSave = await jenisRepo.save(jenis);
        return res.status(200).json({
          info: `😅 200 - Jenis API :: Tambah Baru 🤣`,
          result: resJenisSave
        });
      } else {
        throw new Error('Data Tidak Lengkap!');
      }
    } else {
      return res.status(401).json({
        info: '🙄 401 - Jenis API :: Authorisasi Pengguna Gagal 😪',
        result: {
          message: 'Khusus Admin / Moderator!'
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Jenis API :: Gagal Menambah Jenis Baru 😪',
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
});

// GET `/api/jenis/:id`
router.get('/:id', async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const jenisRepo = getRepository(Jenis);
    const jenis = await jenisRepo.findOneOrFail({
      where: [
        { id: Equal(req.params.id) }
      ]
    });
    return res.status(200).json({
      info: `😅 200 - Jenis API :: List All 🤣`,
      result: jenis
    });
  } catch (error) {
    console.error(error);
    return next(createError(404));
  }
});

// PUT `/api/jenis/:id`
router.put('/:id', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      if ('name' in req.body) {
        try {
          const jenisRepo = getRepository(Jenis);
          const jenis = await jenisRepo.findOneOrFail({
            where: [
              { id: Equal(req.params.id) }
            ]
          });
          if (req.body.name) {
            jenis.name = req.body.name;
          }
          const resJenisSave = await jenisRepo.save(jenis);
          return res.status(200).json({
            info: `😅 200 - Jenis API :: Ubah ${req.params.id} 🤣`,
            result: resJenisSave
          });
        } catch (err) {
          console.error(err);
          return next(createError(404));
        }
      } else {
        throw new Error('Data Tidak Lengkap!');
      }
    } else {
      return res.status(401).json({
        info: '🙄 401 - Jenis API :: Authorisasi Pengguna Gagal 😪',
        result: {
          message: 'Khusus Admin / Moderator!'
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Jenis API :: Gagal Menambah Jenis Baru 😪',
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
});

// DELETE `/api/jenis/:id`
router.delete('/:id', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      const jenisRepo = getRepository(Jenis);
      const jenis =  await jenisRepo.findOneOrFail({
        where: [
          { id: Equal(req.params.id) }
        ]
      });
      const deletedJenis = await jenisRepo.remove(jenis);
      return res.status(200).json({
        info: `😅 200 - Jenis API :: Berhasil Menghapus Jenis ${req.params.id} 🤣`,
        results: deletedJenis
      });
    } else {
      return res.status(401).json({
        info: '🙄 401 - Jenis API :: Authorisasi Pengguna Gagal 😪',
        result: {
          message: 'Khusus Admin !'
        }
      });
    }
  } catch (error) {
    console.error(error);
    return next(createError(404));
  }
});

export default router;

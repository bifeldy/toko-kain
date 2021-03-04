import createError from 'http-errors';

import { Router, Response, NextFunction } from 'express';
import { getRepository, Equal } from 'typeorm';

import { UserRequest } from '../models/UserRequest';

import { Role } from '../../app/_shared/models/Role';

import { Kategori } from '../entities/Kategori';

// Middleware
import auth from '../middlewares/auth';

const router = Router();

// GET `/api/kategori`
router.get('/', async (req: UserRequest, res: Response, next: NextFunction) => {
  const kategoriRepo = getRepository(Kategori);
  const [kategoris, count] = await kategoriRepo.findAndCount({
    order: {
      name: 'ASC'
    }
  });
  return res.status(200).json({
    info: `😅 200 - Kategori API :: List All 🤣`,
    count,
    pages: 1,
    results: kategoris
  });
});

// POST `/api/kategori`
router.post('/', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      if ('name' in req.body) {
        const kategoriRepo = getRepository(Kategori);
        const kategori = new Kategori();
        kategori.name = req.body.name;
        const resKategoriSave = await kategoriRepo.save(kategori);
        return res.status(200).json({
          info: `😅 200 - Kategori API :: Tambah Baru 🤣`,
          result: resKategoriSave
        });
      } else {
        throw new Error('Data Tidak Lengkap!');
      }
    } else {
      return res.status(401).json({
        info: '🙄 401 - Kategori API :: Authorisasi Pengguna Gagal 😪',
        result: {
          message: 'Khusus Admin / Moderator!'
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Kategori API :: Gagal Menambah Kategori Baru 😪',
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
});

// GET `/api/kategori/:id`
router.get('/:id', async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const kategoriRepo = getRepository(Kategori);
    const kategori = await kategoriRepo.findOneOrFail({
      where: [
        { id: Equal(req.params.id) }
      ]
    });
    return res.status(200).json({
      info: `😅 200 - Kategori API :: List All 🤣`,
      result: kategori
    });
  } catch (error) {
    console.error(error);
    return next(createError(404));
  }
});

// PUT `/api/kategori/:id`
router.put('/:id', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      if ('name' in req.body) {
        try {
          const kategoriRepo = getRepository(Kategori);
          const kategori = await kategoriRepo.findOneOrFail({
            where: [
              { id: Equal(req.params.id) }
            ]
          });
          if (req.body.name) {
            kategori.name = req.body.name;
          }
          const resKategoriSave = await kategoriRepo.save(kategori);
          return res.status(200).json({
            info: `😅 200 - Kategori API :: Ubah ${req.params.id} 🤣`,
            result: resKategoriSave
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
        info: '🙄 401 - Kategori API :: Authorisasi Pengguna Gagal 😪',
        result: {
          message: 'Khusus Admin / Moderator!'
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Kategori API :: Gagal Menambah Kategori Baru 😪',
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
});

// DELETE `/api/kategori/:id`
router.delete('/:id', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      const kategoriRepo = getRepository(Kategori);
      const kategori =  await kategoriRepo.findOneOrFail({
        where: [
          { id: Equal(req.params.id) }
        ]
      });
      const deletedKategori = await kategoriRepo.remove(kategori);
      return res.status(200).json({
        info: `😅 200 - Kategori API :: Berhasil Menghapus Kategori ${req.params.id} 🤣`,
        results: deletedKategori
      });
    } else {
      return res.status(401).json({
        info: '🙄 401 - Kategori API :: Authorisasi Pengguna Gagal 😪',
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

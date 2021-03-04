import createError from 'http-errors';

import { Router, Response, NextFunction } from 'express';
import { getRepository, Equal, In } from 'typeorm';

import { UserRequest } from '../models/UserRequest';

import { Role } from '../../app/_shared/models/Role';

import { Jenis } from '../entities/Jenis';
import { Kategori } from '../entities/Kategori';
import { Tipe } from '../entities/Tipe';

// Middleware
import auth from '../middlewares/auth';

const router = Router();

// GET `/api/tipe?kategori=<id>&jenis=<id>`
router.get('/', async (req: UserRequest, res: Response, next: NextFunction) => {
  const jenis_id = req.query.jenis ? req.query.jenis.split(',').map(Number) : [];
  const kategori_id = req.query.kategori ? req.query.kategori.split(',').map(Number) : [];
  const tipeRepo = getRepository(Tipe);
  let tipeRepoQuery = tipeRepo.createQueryBuilder('tipe')
    .leftJoinAndSelect('tipe.jenis_', 'jenis_')
    .leftJoinAndSelect('tipe.kategori_', 'kategori_')
  ;
  if (jenis_id.length > 0 && kategori_id.length > 0) {
    tipeRepoQuery = tipeRepoQuery.where(
      'jenis_.id IN (:...jenis_id) AND kategori_.id IN (:...kategori_id)', 
      { jenis_id: jenis_id, kategori_id: kategori_id }
    );
  }
  tipeRepoQuery = tipeRepoQuery.orderBy('tipe.name', 'ASC');
  const [tipes, count] = await tipeRepoQuery.getManyAndCount();
  return res.status(200).json({
    info: `😅 200 - Tipe API :: List All 🤣`,
    count,
    pages: 1,
    results: tipes
  });
});

// POST `/api/tipe`
router.post('/', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      if (
        'name' in req.body &&
        'kategori_id' in req.body && Array.isArray(req.body.kategori_id) && req.body.kategori_id.length > 0 &&
        'jenis_id' in req.body && Array.isArray(req.body.jenis_id) && req.body.jenis_id.length > 0
      ) {
        const tipeRepo = getRepository(Tipe);
        const tipe = new Tipe();
        tipe.name = req.body.name;
        const jenisRepo = getRepository(Jenis);
        const jenis = await jenisRepo.find({
          where: [
            { id: In([req.body.jenis_id]) }
          ]
        });
        tipe.jenis_ = jenis;
        const kategoriRepo = getRepository(Kategori);
        const kategori = await kategoriRepo.find({
          where: [
            { id: In([req.body.kategori_id]) }
          ]
        });
        tipe.kategori_ = kategori;
        const resTipeSave = await tipeRepo.save(tipe);
        return res.status(200).json({
          info: `😅 200 - Tipe API :: Tambah Baru 🤣`,
          result: resTipeSave
        });
      } else {
        throw new Error('Data Tidak Lengkap!');
      }
    } else {
      return res.status(401).json({
        info: '🙄 401 - Tipe API :: Authorisasi Pengguna Gagal 😪',
        result: {
          message: 'Khusus Admin / Moderator!'
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Tipe API :: Gagal Menambah Tipe Baru 😪',
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
});

// GET `/api/tipe/:id`
router.get('/:id', async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const tipeRepo = getRepository(Tipe);
    const tipe = await tipeRepo.findOneOrFail({
      where: [
        { id: Equal(req.params.id) }
      ],
      relations: ['jenis_', 'kategori_']
    });
    return res.status(200).json({
      info: `😅 200 - Tipe API :: List All 🤣`,
      result: tipe
    });
  } catch (error) {
    console.error(error);
    return next(createError(404));
  }
});

// PUT `/api/tipe/:id`
router.put('/:id', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      if (
        'name' in req.body ||
        ('kategori_id' in req.body && Array.isArray(req.body.kategori_id) && req.body.kategori_id.length > 0) ||
        ('jenis_id' in req.body && Array.isArray(req.body.jenis_id) && req.body.jenis_id.length > 0)
      ) {
        try {
          const tipeRepo = getRepository(Tipe);
          const tipe = await tipeRepo.findOneOrFail({
            where: [
              { id: Equal(req.params.id) }
            ],
            relations: ['jenis_', 'kategori_']
          });
          if (req.body.name) {
            tipe.name = req.body.name;
          }
          if (req.body.jenis_id) {
            const jenisRepo = getRepository(Jenis);
            const jenis = await jenisRepo.find({
              where: [
                { id: In([req.body.jenis_id]) }
              ]
            });
            tipe.jenis_ = jenis;
          }
          if (req.body.kategori_id) {
            const kategoriRepo = getRepository(Kategori);
            const kategori = await kategoriRepo.find({
              where: [
                { id: In([req.body.kategori_id]) }
              ]
            });
            tipe.kategori_ = kategori;
          }
          const resTipeSave = await tipeRepo.save(tipe);
          return res.status(200).json({
            info: `😅 200 - Tipe API :: Ubah ${req.params.id} 🤣`,
            result: resTipeSave
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
        info: '🙄 401 - Tipe API :: Authorisasi Pengguna Gagal 😪',
        result: {
          message: 'Khusus Admin / Moderator!'
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Tipe API :: Gagal Menambah Tipe Baru 😪',
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
});

// DELETE `/api/tipe/:id`
router.delete('/:id', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      const tipeRepo = getRepository(Tipe);
      const tipe =  await tipeRepo.findOneOrFail({
        where: [
          { id: Equal(req.params.id) }
        ]
      });
      const deletedTipe = await tipeRepo.remove(tipe);
      return res.status(200).json({
        info: `😅 200 - Tipe API :: Berhasil Menghapus Tipe ${req.params.id} 🤣`,
        results: deletedTipe
      });
    } else {
      return res.status(401).json({
        info: '🙄 401 - Tipe API :: Authorisasi Pengguna Gagal 😪',
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

import createError from 'http-errors';

import { Router, Response, NextFunction } from 'express';
import { getRepository, Equal, In } from 'typeorm';

import { UserRequest } from '../models/UserRequest';

import { Role } from '../../app/_shared/models/Role';

import { Kain } from '../entities/Kain';
import { Tipe } from '../entities/Tipe';

// Middleware
import auth from '../middlewares/auth';
import { Log } from '../entities/Log';

const router = Router();

// GET `/api/kain?tipe=<id>&kategori=<id>&jenis=<id>`
router.get('/', async (req: UserRequest, res: Response, next: NextFunction) => {
  const tipe_id = req.query.tipe ? req.query.tipe.split(',') : [];
  const jenis_id = req.query.jenis ? req.query.jenis.split(',') : [];
  const kategori_id = req.query.kategori ? req.query.kategori.split(',') : [];
  const kainRepo = getRepository(Kain);
  let kainRepoQuery = kainRepo.createQueryBuilder('kain')
    .leftJoinAndSelect('kain.tipe_', 'tipe_')
    .leftJoinAndSelect('tipe_.jenis_', 'jenis_')
    .leftJoinAndSelect('tipe_.kategori_', 'kategori_')
  ;
  if (tipe_id.length > 0 && jenis_id.length > 0 && kategori_id.length > 0) {
    kainRepoQuery = kainRepoQuery.where(
      'tipe_.id IN (:...tipe_id) AND jenis_.id IN (:...jenis_id) AND kategori_.id IN (:...kategori_id)', 
      { tipe_id: tipe_id, jenis_id: jenis_id, kategori_id: kategori_id }
    );
  }
  kainRepoQuery = kainRepoQuery.orderBy('kain.name', 'ASC');
  const [kains, count] = await kainRepoQuery.getManyAndCount();
  const logRepo = getRepository(Log);
  const log = new Log();
  log.url = req.originalUrl;
  if (req.query.jenis) {
    log.jenis = req.query.jenis;
  }
  if (req.query.kategori) {
    log.kategori = req.query.kategori;
  }
  if (req.query.tipe) {
    log.tipe = req.query.tipe;
  }
  logRepo.save(log);
  return res.status(200).json({
    info: `😅 200 - Kain API :: List All 🤣`,
    count,
    pages: 1,
    results: kains
  });
});

// POST `/api/kain`
router.post('/', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      if (
        'name' in req.body &&
        'tipe_id' in req.body && Array.isArray(req.body.tipe_id) && req.body.tipe_id.length > 0
      ) {
        const kainRepo = getRepository(Kain);
        const kain = new Kain();
        kain.name = req.body.name;
        const tipeRepo = getRepository(Tipe);
        const tipe = await tipeRepo.find({
          where: [
            { id: In(req.body.tipe_id) }
          ]
        });
        kain.tipe_ = tipe;
        const resKainSave = await kainRepo.save(kain);
        return res.status(200).json({
          info: `😅 200 - Kain API :: Tambah Baru 🤣`,
          result: resKainSave
        });
      } else {
        throw new Error('Data Tidak Lengkap!');
      }
    } else {
      return res.status(401).json({
        info: '🙄 401 - Kain API :: Authorisasi Pengguna Gagal 😪',
        result: {
          message: 'Khusus Admin / Moderator!'
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Kain API :: Gagal Menambah Kain Baru 😪',
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
});

// GET `/api/kain/:id`
router.get('/:id', async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const kainRepo = getRepository(Kain);
    const kain = await kainRepo.findOneOrFail({
      where: [
        { id: Equal(req.params.id) }
      ],
      relations: ['tipe_', 'tipe_.jenis_', 'tipe_.kategori_']
    });
    return res.status(200).json({
      info: `😅 200 - Kain API :: List All 🤣`,
      result: kain
    });
  } catch (error) {
    console.error(error);
    return next(createError(404));
  }
});

// PUT `/api/kain/:id`
router.put('/:id', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      if (
        'name' in req.body ||
        'tipe_id' in req.body && Array.isArray(req.body.tipe_id) && req.body.tipe_id.length > 0
        ) {
        try {
          const kainRepo = getRepository(Kain);
          const kain = await kainRepo.findOneOrFail({
            where: [
              { id: Equal(req.params.id) }
            ],
            relations: ['tipe_', 'tipe_.jenis_', 'tipe_.kategori_']
          });
          if (req.body.name) {
            kain.name = req.body.name;
          }
          if (req.body.tipe_id) {
            const tipeRepo = getRepository(Tipe);
            const tipe = await tipeRepo.find({
              where: [
                { id: In(req.body.tipe_id) }
              ]
            });
            kain.tipe_ = tipe;
          }
          const resKainSave = await kainRepo.save(kain);
          return res.status(200).json({
            info: `😅 200 - Kain API :: Ubah ${req.params.id} 🤣`,
            result: resKainSave
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
        info: '🙄 401 - Kain API :: Authorisasi Pengguna Gagal 😪',
        result: {
          message: 'Khusus Admin / Moderator!'
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Kain API :: Gagal Menambah Kain Baru 😪',
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
});

// DELETE `/api/kain/:id`
router.delete('/:id', auth.isAuthorized, async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role === Role.ADMIN) {
      const kainRepo = getRepository(Kain);
      const kain =  await kainRepo.findOneOrFail({
        where: [
          { id: Equal(req.params.id) }
        ]
      });
      const deletedKain = await kainRepo.remove(kain);
      return res.status(200).json({
        info: `😅 200 - Kain API :: Berhasil Menghapus Kain ${req.params.id} 🤣`,
        results: deletedKain
      });
    } else {
      return res.status(401).json({
        info: '🙄 401 - Kain API :: Authorisasi Pengguna Gagal 😪',
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

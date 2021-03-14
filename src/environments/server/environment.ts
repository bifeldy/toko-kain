// Database Entities
import { Jenis } from '../../api/entities/Jenis';
import { Kain } from '../../api/entities/Kain';
import { Kategori } from '../../api/entities/Kategori';
import { Log } from '../../api/entities/Log';
import { Tipe } from '../../api/entities/Tipe';
import { User } from '../../api/entities/User';

export const environment = {
  production: true,
  siteName: 'Toko Kain',
  jwtSecretKey: 'Toko-Kain-Dev',
  tokenName: 'toko-kain_token',
  appPort: 4000,
  dbType: 'postgres',
  dbHost: 'postgres',
  dbPort: 5432,
  dbName: 'tokokain_demo_dev',
  dbUsername: 'postgres',
  dbPassword: 'tokokain!',
  dbEntities: [
    Jenis,
    Kain,
    Log,
    Kategori,
    Tipe,
    User
  ]
};

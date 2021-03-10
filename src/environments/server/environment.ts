// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Database Entities
import { Jenis } from '../../api/entities/Jenis';
import { Kain } from '../../api/entities/Kain';
import { Kategori } from '../../api/entities/Kategori';
import { Tipe } from '../../api/entities/Tipe';
import { User } from '../../api/entities/User';

export const environment = {
  production: false,
  siteName: 'Toko Kain',
  jwtSecretKey: 'Toko-Kain-Dev',
  tokenName: 'toko-kain_token',
  appPort: 4000,
  dbType: 'postgres',
  dbHost: 'localhost',
  dbPort: 5432,
  dbName: 'tokokain_demo_dev',
  dbUsername: 'postgres',
  dbPassword: 'postgres',
  dbEntities: [
    Jenis,
    Kain,
    Kategori,
    Tipe,
    User
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */

// import 'zone.js/dist/zone-error';
// Included with Angular CLI.

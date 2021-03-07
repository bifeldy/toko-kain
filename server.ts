import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import { createConnection } from 'typeorm';

import cors from 'cors';
import cookieParser from 'cookie-parser';

import MorganChalk from './src/api/helpers/morganChalk';

import { environment } from './src/environments/server/environment';

const dbType = process.env.DB_TYPE || environment.dbType;
const dbHost = process.env.DB_HOST || environment.dbHost;
const dbPort = process.env.DB_PORT || environment.dbPort;
const dbName = process.env.DB_NAME || environment.dbName;
const dbUsername = process.env.DB_USERNAME || environment.dbUsername;
const dbPassword = process.env.DB_PASSWORD || environment.dbPassword;
const dbEntities = process.env.DB_ENTITIES || environment.dbEntities;

const typeOrmConfig: any = {
  type: dbType,
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbName,
  synchronize: true,
  logging: false,
  entities: dbEntities
};

// Express Router
import indexRouter from './src/api/routes';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {

  const server = express();

  // Middleware
  server.use(cookieParser());
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use(cors());
  server.use(MorganChalk.morganChalk);

  const distFolder = join(process.cwd(), 'dist/toko-kain/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Example Express Rest API endpoints
  server.use('/api', indexRouter);

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  createConnection({
    ...typeOrmConfig
  }).then(async connection => {
    const c: any = connection;
    // tslint:disable-next-line: max-line-length
    console.log(`[DB] 📚 ${c.options.type} Database ~ ${c.options.username}@${c.options.host}:${c.options.port}/${c.options.database} 🎀`);
    const port = process.env.PORT || 4000;
    const listener: any = app().listen(port, () => {
      console.log(`[HTTP] ✨ Node Angular TypeORM Express ~ ${listener.address().address}:${listener.address().port} 💘`);
    });
  }).catch(
    error => console.error(error)
  );
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';

import { getRepository, Equal } from 'typeorm';

import { Response, NextFunction } from 'express';

import { UserRequest } from '../models/UserRequest';

import { User } from '../entities/User';

import CryptoJS from 'crypto-js';

import { environment } from '../../environments/server/environment';

// Helper
import jwt from '../helpers/jwt';

// tslint:disable-next-line: typedef
async function registerModule(req: UserRequest, res: Response, next: NextFunction) {
  try {
    if ('username' in req.body && 'email' in req.body && 'password' in req.body) {
      const userRepo = getRepository(User);
      const selectedUser = await userRepo.find({
        where: [
          { username: Equal(req.body.username) },
          { email: Equal(req.body.email) }
        ]
      });
      if (selectedUser.length === 0) {
        const newUser = new User();
        newUser.username = req.body.username.replace(/\s/g, '');
        newUser.email = req.body.email.replace(/\s/g, '');
        newUser.password = CryptoJS.SHA512(req.body.password).toString();
        let resUserSave = await userRepo.save(newUser);
        const { password, session_token, ...noPwdSsToken } = resUserSave;
        newUser.session_token = jwt.JwtEncode(noPwdSsToken, false);
        resUserSave = await userRepo.save(newUser);
        req.user = (resUserSave as any);
        return next();
      } else {
        const result: any = {};
        for (const sU of selectedUser) {
          if (sU.username === req.body.username) {
            result.username = `${sU.username} Sudah Terpakai`;
          }
          if (sU.email === req.body.email) {
            result.email = `${sU.email} Sudah Terpakai`;
          }
        }
        return res.status(400).json({
          info: '🙄 400 - Authentication API :: Pendaftaran Gagal 😪',
          result
        });
      }
    } else {
      throw new Error('Data Tidak Lengkap!');
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Authentication API :: Pendaftaran Gagal 😪',
      result: {
        message: 'Data Tidak Lengkap!'
      }
    });
  }
}

// tslint:disable-next-line: typedef
async function loginModule(req: UserRequest, res: Response, next: NextFunction) {
  try {
    if ('userNameOrEmail' in req.body && 'password' in req.body) {
      const reqBodyPassword = CryptoJS.SHA512(req.body.password).toString();
      const userRepo = getRepository(User);
      const selectedUser = await userRepo.findOneOrFail({
        where: [
          { username: Equal(req.body.userNameOrEmail), password: Equal(reqBodyPassword) },
          { email: Equal(req.body.userNameOrEmail), password: Equal(reqBodyPassword) }
        ]
      });
      const { password, session_token, ...noPwdSsToken } = selectedUser;
      const rememberMe = ('rememberMe' in req.body && JSON.parse(req.body.rememberMe) === true);
      selectedUser.session_token = jwt.JwtEncode(noPwdSsToken, rememberMe);
      const resUserSave = await userRepo.save(selectedUser);
      req.user = (resUserSave as any);
      res.cookie(environment.tokenName, req.user.session_token, {
        // tslint:disable-next-line: max-line-length
        httpOnly: true, secure: environment.production, sameSite: 'strict', expires: new Date(jwt.JwtView(req.user.session_token).exp * 1000)
      });
      return next();
    } else {
      throw new Error('Username, Email, atau Password tidak tepat!');
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      info: '🙄 400 - Authentication API :: Login Gagal! 😪',
      result: {
        message: 'Username, Email, atau Password tidak tepat!'
      }
    });
  }
}

// tslint:disable-next-line: typedef
async function isAuthorized(req: UserRequest, res: Response, next: NextFunction) {
  const decoded = jwt.JwtDecode(req, res, next);
  if (decoded && 'token' in decoded && 'id' in decoded.user) {
    const userRepo = getRepository(User);
    const selectedUser = await userRepo.find({
      where: [
        { id: Equal(decoded.user.id), session_token: Equal(decoded.token) }
      ],
    });
    if (selectedUser.length === 1) {
      const usr = selectedUser[0];
      delete usr.password;
      delete usr.session_token;
      req.user = (usr as any);
      return next();
    } else {
      res.cookie(environment.tokenName, 'TOKEN_EXPIRED', { maxAge: 0 });
      return res.status(401).json({
        info: '🙄 401 - Authentication API :: Authorisasi Sesi Gagal 😪',
        result: {
          message: 'Akses Token Ditolak!'
        }
      });
    }
  }
}

// tslint:disable-next-line: typedef
async function isLogin(req: UserRequest, res: Response, next: NextFunction) {
  try {
    // tslint:disable-next-line: max-line-length
    const token = req.cookies[environment.tokenName] || req.headers.authorization || req.headers['x-access-token'] || req.body.token || req.query.token || '';
    if (token) {
      isAuthorized(req, res, next);
    } else {
      throw new Error('User Is Not Login');
    }
  } catch (err) {
    // console.error(err);
    req.user = null;
    return next();
  }
}

// tslint:disable-next-line: typedef
async function logoutModule(req: UserRequest, res: Response, next: NextFunction) {
  const decoded = jwt.JwtDecode(req, res, next);
  if (decoded && 'token' in decoded && 'id' in decoded.user) {
    try {
      const userRepo = getRepository(User);
      const selectedUser = await userRepo.findOneOrFail({
        where: [
          { id: Equal(decoded.user.id), session_token: Equal(decoded.token) }
        ]
      });
      selectedUser.session_token = null;
      const resUserSave = await userRepo.save(selectedUser);
      const { password, session_token, ...noPwdSsToken } = resUserSave;
      req.user = (noPwdSsToken as any);
      res.cookie(environment.tokenName, 'TOKEN_EXPIRED', { maxAge: 0 });
      return next();
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        info: '🙄 400 - Authentication API :: Logout Gagal 😪',
        result: {
          message: 'Sesi Anda Tidak Dapat Dicocokkan!'
        }
      });
    }
  }
}

const auth = { loginModule, isAuthorized, isLogin, logoutModule, registerModule };
export default auth;

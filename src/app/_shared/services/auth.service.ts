import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import User from '../models/User';

import { GlobalService } from './global.service';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private gs: GlobalService,
    private api: ApiService
  ) {
    if (this.gs.isBrowser) {
      this.currentUserSubject = new BehaviorSubject<User>(null);
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }

  public get currentUserValue(): User {
    return this.currentUserSubject ? this.currentUserSubject.value : null;
  }

  verify(token: any): Observable<any> {
    this.gs.log('[AUTH_VERIFY]', token);
    return this.api.postData(`/verify`, { token }).pipe(map((respVerify: any) => {
      this.currentUserSubject.next(respVerify.result);
      return respVerify;
    }));
  }

  login(loginData: any): Observable<any> {
    this.gs.log('[AUTH_LOGIN]', loginData);
    return this.api.postData(`/login`, loginData).pipe(map(respLogin => {
      return respLogin;
    }));
  }

  register(registerData: any): Observable<any> {
    this.gs.log('[AUTH_REGISTER]', registerData);
    return this.api.postData(`/register`, registerData).pipe(map(respRegister => {
      return respRegister;
    }));
  }

  logout(): Observable<any> {
    this.gs.log('[AUTH_LOGOUT]', 'THE_TOKEN_ALREADY_IN_COOKIE_RIGHT_?');
    return this.api.deleteData(`/logout`).pipe(map(respLogout => {
      this.removeUser();
      return respLogout;
    }));
  }

  removeUser(): void {
    this.currentUserSubject.next(null);
  }

}

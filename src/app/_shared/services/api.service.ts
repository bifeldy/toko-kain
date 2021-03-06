import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, timeout, map, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/client/environment';

import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private gs: GlobalService
  ) {
    if (this.gs.isBrowser) {
      //
    }
  }

  HTTP_REQ_URL(path: string): string {
    if (path.startsWith('http')) {
      return path;
    } else if (!this.gs.isBrowser) {
      return environment.baseUrl + environment.apiUrl + path;
    } else {
      return environment.apiUrl + path;
    }
  }

  getData(path: string, options = {}, timedOut = 10000): Observable<any> {
    return this.http.get(this.HTTP_REQ_URL(path), options).pipe(
      catchError(err => throwError(err)),
      map(res => res), timeout(timedOut), retry(5)
    );
  }

  postData(path: string, model = {}, multipart = false, options = {}, timedOut = 10000): Observable<any> {
    this.gs.log('[API_POST]', path);
    let body = model;
    if (multipart) {
      body = this.prepareFormData(model);
    }
    return this.http.post(this.HTTP_REQ_URL(path), body, options).pipe(
      catchError(err => throwError(err)),
      map(res => res), timeout(timedOut)
    );
  }

  putData(path: string, model = {}, multipart = false, options = {}, timedOut = 10000): Observable<any> {
    this.gs.log('[API_PUT]', path);
    let body = model;
    if (multipart) {
      body = this.prepareFormData(model);
    }
    return this.http.put(this.HTTP_REQ_URL(path), body, options).pipe(
      catchError(err => throwError(err)),
      map(res => res), timeout(timedOut)
    );
  }

  patchData(path: string, model = {}, multipart = false, options = {}, timedOut = 10000): Observable<any> {
    this.gs.log('[API_PATCH]', path);
    let body = model;
    if (multipart) {
      body = this.prepareFormData(model);
    }
    return this.http.patch(this.HTTP_REQ_URL(path), body, options).pipe(
      catchError(err => throwError(err)),
      map(res => res), timeout(timedOut)
    );
  }

  deleteData(path: string, timedOut = 10000): Observable<any> {
    this.gs.log('[API_DEL]', path);
    return this.http.delete(this.HTTP_REQ_URL(path)).pipe(
      catchError(err => throwError(err)),
      map(res => res), timeout(timedOut)
    );
  }

  private prepareFormData(data: any): FormData {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return formData;
  }

}

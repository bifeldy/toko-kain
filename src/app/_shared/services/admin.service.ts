import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private api: ApiService,
    private gs: GlobalService
  ) {
    if (this.gs.isBrowser) {
      //
    }
  }

  getAllKategori(): Observable<any> {
    return this.api.getData(`/kategori`);
  }

  addKategori(data): Observable<any> {
    return this.api.postData(`/kategori`, data);
  }

  getAllJenis(): Observable<any> {
    return this.api.getData(`/jenis`);
  }

  addJenis(data): Observable<any> {
    return this.api.postData(`/jenis`, data);
  }

  getAllTipe(): Observable<any> {
    return this.api.getData(`/tipe`);
  }

  getTipe(kategoriId, jenisId): Observable<any> {
    return this.api.getData(`/tipe?kategori=${kategoriId}&jenis=${jenisId}`);
  }

  addTipe(data): Observable<any> {
    return this.api.postData(`/tipe`, data);
  }

  getAllKain(): Observable<any> {
    return this.api.getData(`/kain`);
  }

  getKain(tipeId, kategoriId, jenisId): Observable<any> {
    return this.api.getData(`/kain?tipe=${tipeId}&kategori=${kategoriId}&jenis=${jenisId}`);
  }

  addKain(data): Observable<any> {
    return this.api.postData(`/kain`, data);
  }

}

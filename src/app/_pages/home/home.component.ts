import { Component, OnInit, OnDestroy } from '@angular/core';

import { GlobalService } from '../../_shared/services/global.service';
import { AdminService } from '../../_shared/services/admin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  kategori_id = null;
  kategori = [];

  jenis_id = null;
  jenis = [];

  tipe_id = [];
  tipe = [];

  kain = [];

  subsKategoriGet = null;
  subsJenisGet = null;
  subsTipeGet = null;
  subsKainGet = null;

  constructor(
    public gs: GlobalService,
    public a: AdminService
  ) {
    if (this.gs.isBrowser) {
      //
    }
  }

  ngOnInit(): void {
    if (this.gs.isBrowser) {
      this.getKategori();
      this.getJenis();
    }
  }

  ngOnDestroy(): void {
    if (this.subsKategoriGet) {
      this.subsKategoriGet.unsubscribe();
    }
    if (this.subsJenisGet) {
      this.subsJenisGet.unsubscribe();
    }
    if (this.subsTipeGet) {
      this.subsTipeGet.unsubscribe();
    }
    if (this.subsKainGet) {
      this.subsKainGet.unsubscribe();
    }
  }

  kategoriSelected($event): void {
    this.tipe_id = [];
    if (this.kategori_id && this.jenis_id) {
      this.getTipe(this.kategori_id, this.jenis_id);
    }
  }

  jenisSelected($event): void {
    this.tipe_id = [];
    if (this.kategori_id && this.jenis_id) {
      this.getTipe(this.kategori_id, this.jenis_id);
    }
  }

  tipeSelected($event, tipeId): void {
    const idx = this.tipe.findIndex(t => t.id === tipeId);
    this.tipe[idx].selected = !this.tipe[idx].selected;
    if (this.tipe[idx].selected) {
      this.tipe_id.push(this.tipe[idx].id);
    } else {
      this.tipe_id = this.tipe_id.filter(x => x !== this.tipe[idx].id);
    }
    if (this.tipe_id.length > 0) {
      this.getKain(this.tipe_id, this.kategori_id, this.jenis_id);
    } else {
      this.kain = [];
    }
  }

  getKategori(): void {
    this.subsKategoriGet = this.a.getAllKategori().subscribe({
      next: (res: any) => {
        this.gs.log('[KATEGORI_GET_SUCCESS]', res);
        this.kategori = res.results;
      },
      error: err => {
        this.gs.log('[KATEGORI_GET_ERROR]', err);
      }
    });
  }

  getJenis(): void {
    this.subsJenisGet = this.a.getAllJenis().subscribe({
      next: (res: any) => {
        this.gs.log('[JENIS_GET_SUCCESS]', res);
        this.jenis = res.results;
      },
      error: err => {
        this.gs.log('[JENIS_GET_ERROR]', err);
      }
    });
  }

  getTipe(kategoriId, jenisId): void {
    this.subsTipeGet = this.a.getTipe(kategoriId, jenisId).subscribe({
      next: (res: any) => {
        this.gs.log('[TIPE_GET_SUCCESS]', res);
        this.tipe = res.results;
      },
      error: err => {
        this.gs.log('[TIPE_GET_ERROR]', err);
      }
    });
  }

  getKain(tipeId, kategoriId, jenisId): void {
    this.subsKainGet = this.a.getKain(tipeId, kategoriId, jenisId).subscribe({
      next: (res: any) => {
        this.gs.log('[KAIN_GET_SUCCESS]', res);
        this.kain = res.results;
      },
      error: err => {
        this.gs.log('[KAIN_GET_ERROR]', err);
      }
    });
  }

}

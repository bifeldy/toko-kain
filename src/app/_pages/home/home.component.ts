import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { GlobalService } from '../../_shared/services/global.service';
import { AdminService } from '../../_shared/services/admin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  phoneNumber = '6287871188899';
  phoneNumber02 = '628892366466'

  submitted = false;

  kategori_id = null;
  kategori = [];

  jenis_id = null;
  jenis = [];

  tipe_id_checkbox = [];
  tipe_id_radio = null;
  tipe = [];

  kain_name = [];
  kain = [];

  maxSelectKain = 10;

  subsKategoriGet = null;
  subsJenisGet = null;
  subsTipeGet = null;
  subsKainGet = null;

  constructor(
    private ref: ChangeDetectorRef,
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

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  contactUs(message = 'Hai kak, Aku mau beli kain, stok apa saja yang tersedia?') {
    window.open(`https://wa.me/${this.phoneNumber02}?text=${message}`, '_blank');
  }

  orderKain(): void {
    this.contactUs(`Kak, aku mau pesan kain ini donk. %0A${encodeURIComponent(this.kain_name.map((k, i) => `${i+1}. ${k}`).join('\n'))}.`);
  }

  kategoriSelected($event): void {
    this.tipe_id_checkbox = [];
    if (this.kategori_id && this.jenis_id) {
      this.getTipe(this.kategori_id, this.jenis_id);
    }
  }

  jenisSelected($event): void {
    this.tipe_id_checkbox = [];
    if (this.kategori_id && this.jenis_id) {
      this.getTipe(this.kategori_id, this.jenis_id);
    }
  }

  tipeSelectedRadio($event, tipe): void {
    //
  }

  tipeSelectedCheckbox($event, tipe): void {
    const idx = this.tipe.findIndex(t => t.id === tipe.id);
    this.tipe[idx].selected = !this.tipe[idx].selected;
    if (this.tipe[idx].selected) {
      this.tipe_id_checkbox.push(this.tipe[idx].id);
    } else {
      this.tipe_id_checkbox = this.tipe_id_checkbox.filter(x => x !== this.tipe[idx].id);
    }
  }

  kainSelected($event, kain): void {
    const idx = this.kain.findIndex(k => k.id === kain.id);
    this.kain[idx].selected = !this.kain[idx].selected;
    if (this.kain[idx].selected) {
      if (this.kain_name.length < this.maxSelectKain) {
        this.kain_name.push(this.kain[idx].name);
      } else {
        this.kain[idx].selected = !this.kain[idx].selected;
      }
    } else {
      this.kain_name = this.kain_name.filter(x => x !== this.kain[idx].name);
    }
  }

  requestSample(el: HTMLElement): void {
    this.submitted = true;
    if (this.tipe_id_checkbox.length > 0 || this.tipe_id_radio) {
      this.getKain(this.tipe_id_radio, this.kategori_id, this.jenis_id);
      // this.getKain(this.tipe_id_checkbox, this.kategori_id, this.jenis_id);
    } else {
      this.kain = [];
      this.submitted = false;
    }
    this.scroll(el);
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
    this.tipe_id_radio = null;
    this.tipe_id_checkbox = [];
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
        this.submitted = false;
      },
      error: err => {
        this.gs.log('[KAIN_GET_ERROR]', err);
        this.submitted = false;
      }
    });
  }

}

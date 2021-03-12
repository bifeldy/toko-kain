import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import CryptoJS from 'crypto-js';

import { GlobalService } from '../../_shared/services/global.service';
import { AuthService } from '../../_shared/services/auth.service';
import { AdminService } from '../../_shared/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  submitted = false;

  fgLogin: FormGroup;
  loginToken = '';
  subsLogin = null;

  kategori = [];
  fgKategori: FormGroup;
  subsKategoriGet = null;
  subsKategoriAdd = null;

  jenis = [];
  fgJenis: FormGroup;
  subsJenisGet = null;
  subsJenisAdd = null;

  tipe = [];
  fgTipe: FormGroup;
  subsTipeGet = null;
  subsTipeAdd = null;

  kain = [];
  fgKain: FormGroup;
  subsKainGet = null;
  subsKainAdd = null;

  constructor(
    private fb: FormBuilder,
    public gs: GlobalService,
    public as: AuthService,
    public a: AdminService
  ) {
    if (this.gs.isBrowser) {
      //
    }
  }

  ngOnInit(): void {
    if (this.gs.isBrowser) {
      this.initLogin();
      this.getKategori();
      this.initKategori();
      this.getJenis();
      this.initJenis();
      this.getTipe();
      this.initTipe();
      this.getKain();
      this.initKain();
    }
  }

  ngOnDestroy(): void {
    if (this.subsLogin) {
      this.subsLogin.unsubscribe();
    }
    if (this.subsKategoriGet) {
      this.subsKategoriGet.unsubscribe();
    }
    if (this.subsKategoriAdd) {
      this.subsKategoriAdd.unsubscribe();
    }
    if (this.subsJenisGet) {
      this.subsJenisGet.unsubscribe();
    }
    if (this.subsJenisAdd) {
      this.subsJenisAdd.unsubscribe();
    }
    if (this.subsTipeGet) {
      this.subsTipeGet.unsubscribe();
    }
    if (this.subsTipeAdd) {
      this.subsTipeAdd.unsubscribe();
    }
    if (this.subsKainGet) {
      this.subsKainGet.unsubscribe();
    }
    if (this.subsKainAdd) {
      this.subsKainAdd.unsubscribe();
    }
  }

  // Login --

  initLogin(): void {
    this.fgLogin = this.fb.group({
      userNameOrEmail: ['bifeldy', [Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      password: ['1234567890', [Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)]]
    });
  }

  login(): void {
    this.submitted = true;
    this.gs.log('[LOGIN_FORM_REQUEST]', this.fgLogin.value);
    if (this.fgLogin.invalid) {
      this.submitted = false;
      return;
    }
    if (this.fgLogin.valid) {
      this.submitted = true;
      this.subsLogin = this.as.login({
        userNameOrEmail: this.fgLogin.value.userNameOrEmail,
        password: CryptoJS.SHA512(this.fgLogin.value.password).toString(),
        rememberMe: this.fgLogin.value.rememberMe
      }).subscribe({
        next: (res: any) => {
          this.gs.log('[LOGIN_FORM_SUCCESS]', res);
          this.loginToken = res.result.token;
          this.submitted = false;
        },
        error: err => {
          this.gs.log('[LOGIN_FORM_ERROR]', err);
          this.submitted = false;
        }
      });
    }
  }

  // Kategori --

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

  initKategori(): void {
    this.fgKategori = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)]]
    });
  }

  addKategori(): void {
    this.submitted = true;
    this.subsKategoriAdd = this.a.addKategori({ ...this.fgKategori.value, token: this.loginToken }).subscribe({
      next: (res: any) => {
        this.gs.log('[KATEGORI_ADD_SUCCESS]', res);
        this.getKategori();
        this.submitted = false;
      },
      error: err => {
        this.gs.log('[KATEGORI_ADD_ERROR]', err);
        this.submitted = false;
      }
    });
  }

  // Jenis --

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

  initJenis(): void {
    this.fgJenis = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)]]
    });
  }

  addJenis(): void {
    this.submitted = true;
    this.subsJenisAdd = this.a.addJenis({ ...this.fgJenis.value, token: this.loginToken }).subscribe({
      next: (res: any) => {
        this.gs.log('[JENIS_ADD_SUCCESS]', res);
        this.getJenis();
        this.submitted = false;
      },
      error: err => {
        this.gs.log('[JENIS_ADD_ERROR]', err);
        this.submitted = false;
      }
    });
  }

  // Tipe --

  getTipe(): void {
    this.subsTipeGet = this.a.getAllTipe().subscribe({
      next: (res: any) => {
        this.gs.log('[TIPE_GET_SUCCESS]', res);
        this.tipe = [];
        for (const t of res.results) {
          const tp = {
            id: t.id,
            name: t.name,
            created_at: t.created_at,
            updated_at: t.updated_at,
            jenis_: [],
            kategori_: []
          };
          for (const j of t.jenis_) {
            tp.jenis_.push(j.name);
          }
          for (const k of t.kategori_) {
            tp.kategori_.push(k.name);
          }
          this.tipe.push(tp);
        }
      },
      error: err => {
        this.gs.log('[TIPE_GET_ERROR]', err);
      }
    });
  }

  initTipe(): void {
    this.fgTipe = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      jenis_id: [null, [Validators.required, Validators.pattern(/^[0-9,]*$/)]],
      kategori_id: [null, [Validators.required, Validators.pattern(/^[0-9,]*$/)]]
    });
  }

  addTipe(): void {
    this.submitted = true;
    this.subsTipeAdd = this.a.addTipe({
      name: this.fgTipe.value.name,
      jenis_id: this.fgTipe.value.jenis_id.split(',').map(Number),
      kategori_id: this.fgTipe.value.kategori_id.split(',').map(Number),
      token: this.loginToken
    }).subscribe({
      next: (res: any) => {
        this.gs.log('[TIPE_ADD_SUCCESS]', res);
        this.getTipe();
        this.submitted = false;
      },
      error: err => {
        this.gs.log('[TIPE_ADD_ERROR]', err);
        this.submitted = false;
      }
    });
  }

  // Kain --

  getKain(): void {
    this.subsKainGet = this.a.getAllKain().subscribe({
      next: (res: any) => {
        this.gs.log('[KAIN_GET_SUCCESS]', res);
        this.kain = [];
        for (const k of res.results) {
          const kn = {
            id: k.id,
            name: k.name,
            created_at: k.created_at,
            updated_at: k.updated_at,
            tipe_: []
          };
          for (const t of k.tipe_) {
            kn.tipe_.push(t.name);
          }
          this.kain.push(kn);
        }
      },
      error: err => {
        this.gs.log('[KAIN_GET_ERROR]', err);
      }
    });
  }

  initKain(): void {
    this.fgKain = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(this.gs.allKeyboardKeysRegex)]],
      tipe_id: [null, [Validators.required, Validators.pattern(/^[0-9,]*$/)]]
    });
  }

  addKain(): void {
    this.submitted = true;
    this.subsKainAdd = this.a.addKain({
      name: this.fgKain.value.name,
      tipe_id: this.fgKain.value.tipe_id.split(',').map(Number),
      token: this.loginToken
    }).subscribe({
      next: (res: any) => {
        this.gs.log('[KAIN_ADD_SUCCESS]', res);
        this.submitted = false;
        this.getKain();
      },
      error: err => {
        this.gs.log('[KAIN_ADD_ERROR]', err);
        this.submitted = false;
      }
    });
  }

}

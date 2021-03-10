import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './_pages/home/home.component';
import { JenisComponent } from './_pages/jenis/jenis.component';
import { KainComponent } from './_pages/kain/kain.component';
import { KategoriComponent } from './_pages/kategori/kategori.component';
import { LoginComponent } from './_pages/login/login.component';
import { TipeComponent } from './_pages/tipe/tipe.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'jenis', component: JenisComponent },
  { path: 'kain', component: KainComponent },
  { path: 'kategori', component: KategoriComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tipe', component: TipeComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

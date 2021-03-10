import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedMaterialModule } from './_shared/helpers/shared-material.module';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './_pages/home/home.component';
import { JenisComponent } from './_pages/jenis/jenis.component';
import { KainComponent } from './_pages/kain/kain.component';
import { KategoriComponent } from './_pages/kategori/kategori.component';
import { LoginComponent } from './_pages/login/login.component';
import { TipeComponent } from './_pages/tipe/tipe.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JenisComponent,
    KainComponent,
    KategoriComponent,
    LoginComponent,
    TipeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

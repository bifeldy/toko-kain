import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { SharedMaterialModule } from './_shared/helpers/shared-material.module';
import { SharedBootstrapModule } from './_shared/helpers/shared-bootstrap.module';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
// import { AdminComponent } from './_pages/admin/admin.component';
import { HomeComponent } from './_pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    // AdminComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    TransferHttpCacheModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    SharedBootstrapModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

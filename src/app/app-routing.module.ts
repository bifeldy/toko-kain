import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedMaterialModule } from './_shared/helpers/shared-material.module';

// import { AdminComponent } from './_pages/admin/admin.component';
import { HomeComponent } from './_pages/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  // { path: 'admin', component: AdminComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' })
  ],
  exports: [
    RouterModule,
    SharedMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AppRoutingModule { }

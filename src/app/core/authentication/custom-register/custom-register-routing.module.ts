import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomRegisterPage } from './custom-register.page';

const routes: Routes = [
  {
    path: '',
    component: CustomRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomRegisterPageRoutingModule {}

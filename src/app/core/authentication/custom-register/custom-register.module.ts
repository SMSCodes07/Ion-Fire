import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomRegisterPageRoutingModule } from './custom-register-routing.module';

import { CustomRegisterPage } from './custom-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomRegisterPageRoutingModule
  ],
  declarations: [CustomRegisterPage]
})
export class CustomRegisterPageModule {}

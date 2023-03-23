import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [RegisterComponent, LoginComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  exports: [RegisterComponent, LoginComponent],
})
export class UserModule {}

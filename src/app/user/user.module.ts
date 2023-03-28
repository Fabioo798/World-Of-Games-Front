import { NgModule } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserDetailComponent } from './detail/detail.component';
import { MatIconModule } from '@angular/material/icon';
import { CartComponent } from './cart/cart.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    UserDetailComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    MatIconModule,
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
  ],
  exports: [
    RegisterComponent,
    LoginComponent,
    UserDetailComponent,
    CartComponent,
  ],
})
export class UserModule {}

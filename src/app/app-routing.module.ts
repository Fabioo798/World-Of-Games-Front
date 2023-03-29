import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { DetailComponent } from './game/detail/detail.component';
import { GamesComponent } from './game/games/games.component';
import { AddComponent } from './game/add/add.component';
import { UserDetailComponent } from './user/detail/detail.component';
import { CartComponent } from './user/cart/cart.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: 'games', component: GamesComponent },
  { path: 'games/:id', component: DetailComponent },
  { path: 'create', component: AddComponent },
  { path: 'mygames', component: AddComponent },
  { path: 'cart', component: CartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

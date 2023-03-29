import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeModule } from './home/home.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameModule } from './game/game.module';
import { MatIconModule } from '@angular/material/icon';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InfrastructureModule,
    ReactiveFormsModule,
    HttpClientModule,
    HomeModule,
    RouterModule,
    CommonModule,
    GameModule,
    MatIconModule,
    UserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

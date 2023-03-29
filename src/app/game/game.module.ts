import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesComponent } from './games/games.component';
import { RouterModule } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddComponent } from './add/add.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';





@NgModule({
  declarations: [GamesComponent, DetailComponent, AddComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
  ],
})
export class GameModule {}

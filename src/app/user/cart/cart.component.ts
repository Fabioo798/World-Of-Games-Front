import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { RepoUserService } from 'src/app/services/user/user.service';
import { Game, User } from 'src/app/types/types';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  currentUser$: Observable<User>;

  constructor(
    private srv: RepoUserService,
    public gamesrv: RepoGameService,
    public zone: NgZone
  ) {
    this.currentUser$ = this.srv.getCurrentUser(this.srv.userLogged$.value.id);
  }

  removeGame(game: Game) {
    this.currentUser$.subscribe((user: User) => {
      const shopListIds = (user.shopList as Game[]).map(
        (game) => game.id
      ) as string[];
      const index = shopListIds.findIndex((id) => id === game.id);
      if (index !== -1) {
        shopListIds.splice(index, 1);
        const userId = user.id as string;
        const updatedList: any = { shopList: shopListIds };
        this.srv.updateUser(userId, updatedList).subscribe(() => {
          this.zone.run(() => {
              this.currentUser$ = this.srv.getCurrentUser(this.srv.userLogged$.value.id);
          });
        });
      }
    });
  }
}

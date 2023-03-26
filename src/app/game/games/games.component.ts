import { Component, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { RepoUserService } from 'src/app/services/user/user.service';
import { Game, gameCategory, User } from 'src/app/types/types';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnDestroy {
  currentUser$: Observable<User>;
  games: Game[] = [];
  private tokenSubscription!: Subscription;
  selectedCategory: gameCategory | 'all' = 'all';

  constructor(
    public srv: RepoUserService,
    public router: Router,
    public gamesrv: RepoGameService,
    public zone: NgZone
  ) {
    this.currentUser$ = this.srv.getCurrentUser(this.srv.userLogged$.value.id);
  }

  ngOnInit(): void {
    this.tokenSubscription = this.srv.token$.subscribe((token) => {
      if (token) {
        this.loadGames();
      } else {
        console.log('not logged!');
      }
    });
  }

  ngOnDestroy(): void {
    this.tokenSubscription.unsubscribe();
  }

  onCategorySelect(): void {
    this.loadGames();
  }

  private loadGames(): void {
    this.gamesrv.queryGame(this.selectedCategory).subscribe((games) => {
      this.games = games;
    });
  }

  addCart(game: Game) {
    this.currentUser$.subscribe((user) => {
      const gameId = game.id as string;
      const userId = user.id as string;
      const shopListIds = (user.shopList as Game[]).map(
        (game) => game.id
      ) as string[];
      shopListIds.push(gameId)
      console.log(shopListIds);
      const updatedList: any = { shopList: shopListIds };
      console.log(updatedList);
      this.srv.updateUser(userId, updatedList).subscribe(() => {
        this.zone.run(() => {
          this.router.navigateByUrl('/cart');
        });
      });
    });
  }
}

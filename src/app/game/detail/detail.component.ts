import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { Game } from 'src/app/types/types';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {
  games: Game[] = [];
  game: Game = {} as Game;
  params: Params = { id: '' };
  constructor(public srv: RepoGameService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((p) => (this.params = p));
    this.srv.games$.subscribe((t) => {
      this.games = t;
    });
    this.findGame();
  }

  findGame() {
    const found = this.games.find((game) => game.id === this.params['id']);
    if (!found) return;
    this.game = found;
  }
}

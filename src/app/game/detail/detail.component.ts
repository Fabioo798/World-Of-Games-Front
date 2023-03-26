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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  findGame() {
    const found = this.games.find((game) => game.id === this.params['id']);
    console.log(found);
    if (!found) return;
    this.game = found;
  }
}

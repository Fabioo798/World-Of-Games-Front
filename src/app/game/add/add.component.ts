import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { Game } from 'src/app/types/types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  newGame: FormGroup;
  @Output() onAdd: EventEmitter<Game>;
  isSuccess: boolean;
  isError: boolean;
  isUpdate: boolean;
  @Input() gameToUpdate: Game | undefined;

  constructor(
    public form: FormBuilder,
    public srv: RepoGameService,
    public router: Router,
    public zone: NgZone,
    public route: ActivatedRoute
  ) {
    this.onAdd = new EventEmitter();
    this.newGame = form.group({
      gameName: ['', Validators.required],
      releaseDate: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1.0)]],
      description: '',
      img: '',
    });
    this.isSuccess = false;
    this.isError = false;
    this.isUpdate = false;
  }

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get('gameToUpdate'));
    const gameToUpdateString = this.route.snapshot.paramMap.get('gameToUpdate');
    this.gameToUpdate = JSON.parse(gameToUpdateString as string) as Game;
    if (this.gameToUpdate) {
      this.newGame.setValue({
        gameName: this.gameToUpdate.gameName,
        releaseDate: this.gameToUpdate.releaseDate,
        category: this.gameToUpdate.category,
        price: this.gameToUpdate.price,
        description: this.gameToUpdate.description,
        img: '',
      });
      this.isUpdate = true;
    }
  }

  handleSubmit() {
    const sendNewGame: Game = {
      gameName: this.newGame.value.gameName,
      releaseDate: this.newGame.value.releaseDate,
      category: this.newGame.value.category,
      price: this.newGame.value.price,
      description: this.newGame.value.description,
      img: this.newGame.value.img,
    };

    let observable: Observable<any>;

    if (this.gameToUpdate) {
      observable = this.srv.updateGame(
        this.gameToUpdate.id as string,
        sendNewGame
      );
    } else {
      observable = this.srv.createGame(sendNewGame);
    }

    observable.subscribe({
      next: () => {
        this.isSuccess = true;
        setTimeout(() => {
          this.isSuccess = false;
          this.zone.run(() => {
            this.router.navigate(['/user/:id']);
          });
        }, 2000);
      },
      error: (error: any) => {
        console.log(error);
        this.isError = true;
        setTimeout(() => {
          this.isError = false;
        }, 2000);
      },
      complete: () => {
        this.newGame.reset();
      },
    });
  }

  get submitButtonLabel() {
    return this.gameToUpdate ? 'Save' : 'Create';
  }
}

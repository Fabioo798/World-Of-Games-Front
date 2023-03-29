import {
  Component,
  EventEmitter,
  inject,
  NgZone,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { Game } from 'src/app/types/types';
import { ActivatedRoute } from '@angular/router';
import {
  getDownloadURL,
  ref,
  Storage,
  StorageReference,
  uploadBytes,
} from '@angular/fire/storage';

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
  gameToUpdate: Game | undefined;
  private storage: Storage;
  private gameImg: File;

  constructor(
    public form: FormBuilder,
    public srv: RepoGameService,
    public router: Router,
    public zone: NgZone,
    public route: ActivatedRoute
  ) {
    this.gameImg = new File([], '');
    this.storage = inject(Storage);
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

  saveImage(event: any) {
    this.gameImg = event.target.files[0];
  }

  async uploadImage(storage: StorageReference, avatar: File): Promise<void> {
    await uploadBytes(storage, avatar);
  }

  async getImage(storage: StorageReference): Promise<string> {
    const avatar = await getDownloadURL(storage);
    return avatar;
  }

  ngOnInit() {
    this.gameToUpdate = this.srv.gameInfo$.value;
    if (this.gameToUpdate && this.gameToUpdate.id) {
      this.newGame.patchValue({
        gameName: this.gameToUpdate.gameName,
        releaseDate: this.gameToUpdate.releaseDate,
        category: this.gameToUpdate.category,
        price: this.gameToUpdate.price,
        description: this.gameToUpdate.description,
        img: '',
      });
      this.isUpdate = true;
      this.srv.gameInfo$.next({} as Game);
    }
  }

  async handleSubmit() {
    let gameImg = '';
    let observable: Observable<any>;

    if (this.gameImg.name) {
      const avatarRef = ref(
        this.storage,
        `games/${this.newGame.value.gameName}`
      );

      await this.uploadImage(avatarRef, this.gameImg);

      gameImg = await this.getImage(avatarRef);
    }
    const sendNewGame: Game = {
      gameName: this.newGame.value.gameName,
      releaseDate: this.newGame.value.releaseDate,
      category: this.newGame.value.category,
      price: this.newGame.value.price,
      description: this.newGame.value.description,
      img: gameImg,
    };

    if (this.isUpdate === true) {
      observable = this.srv.updateGame(
        this.gameToUpdate?.id as string,
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
      error: () => {
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

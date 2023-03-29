import { Component, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  Storage,
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
} from '@angular/fire/storage';
import { RepoUserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/types/types';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  newUser: FormGroup;
  isSuccess: boolean;
  isError: boolean;
  isUpdate: boolean;
  private storage: Storage;
  public userImg: File;
  userToUpdate: User | undefined;

  constructor(
    public form: FormBuilder,
    public srv: RepoUserService,
    public router: Router,
    public zone: NgZone
  ) {
    this.userImg = new File([], '');
    this.storage = inject(Storage);
    this.newUser = form.group({
      name: '',
      email: '',
      password: '',
      img: '',
    });
    this.isSuccess = false;
    this.isError = false;
    this.isUpdate = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveImage(event: any) {
    this.userImg = event.target.files[0];
  }

  async uploadImage(storage: StorageReference, avatar: File): Promise<void> {
    await uploadBytes(storage, avatar);
  }

  async getImage(storage: StorageReference): Promise<string> {
    const avatar = await getDownloadURL(storage);
    return avatar;
  }

  ngOnInit() {
    const currentUser = this.srv.currentUser$.value;
    if (currentUser && currentUser.id) {
      this.userToUpdate = currentUser;
      this.newUser.patchValue({
        name: this.userToUpdate.name,
        email: this.userToUpdate.email,
        password: this.userToUpdate.password,
        img: '',
      });
      this.isUpdate = true;
    }
  }

  async handleSubmit() {
    let avatar = '';
    let observable1: Observable<any>;

    if (this.userImg.name) {
      const avatarRef = ref(
        this.storage,
        `avatars/${this.newUser.value.email}`
      );

      await this.uploadImage(avatarRef, this.userImg);

      avatar = await this.getImage(avatarRef);
    }

    const sendNewUser: User = {
      name: this.newUser.value.name,
      email: this.newUser.value.email,
      password: this.newUser.value.password,
      img: avatar,
    };
    if (this.isUpdate === false) {
      observable1 = this.srv.registerUser(sendNewUser);
    } else {
      observable1 = this.srv.updateUser(
        this.userToUpdate!.id as string,
        sendNewUser
      );
    }

    observable1.subscribe({
      next: () => {
        this.isSuccess = true;
        setTimeout(() => {
          this.isSuccess = false;
          this.zone.run(() => {
            if (this.isUpdate === true) {
              this.router.navigate([`/user/:${this.userToUpdate!.id}`]);
            } else {
              this.router.navigate(['/login']);
            }
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
        this.newUser.reset();
      },
    });
  }

  get submitButtonLabel() {
    return this.userToUpdate ? 'Save' : 'Register';
  }
}

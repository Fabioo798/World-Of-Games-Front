import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RepoUserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/types/types';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  editUser: FormGroup;
  @Output() onAdd: EventEmitter<User>;
  isSuccess: boolean;
  isError: boolean;
  isUpdate: boolean;
  @Input() userToUpdate: User | undefined;

  constructor(
    public form: FormBuilder,
    public srv: RepoUserService,
    public router: Router,
    public zone: NgZone,
    public route: ActivatedRoute
  ) {
    this.onAdd = new EventEmitter();
    this.editUser = form.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      // password: ['', Validators.required],
      img: ['', Validators.required],
    });
    this.isSuccess = false;
    this.isError = false;
    this.isUpdate = false;
  }

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get('userToUpdate'));
    const UserToUpdateString = this.route.snapshot.paramMap.get('userToUpdate');
    this.userToUpdate = JSON.parse(UserToUpdateString as string) as User;
    if (this.userToUpdate) {
      this.editUser.setValue({
        name: this.userToUpdate.name,
        email: this.userToUpdate.email,
        // password: this.userToUpdate.password,
        img: '',
      });
    }
  }

  handleSubmit() {
    const sendUpdateUser = {
      name: this.editUser.value.name,
      email: this.editUser.value.email,
      img: this.editUser.value.img,
    } as User;

    this.srv
      .updateUser(this.userToUpdate?.id as string, sendUpdateUser)
      .subscribe({
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
          this.editUser.reset();
        },
      });;
  }
}

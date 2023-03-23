import { Component, EventEmitter, NgZone, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User, repoService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  newUser: FormGroup;
  @Output() onAdd: EventEmitter<User>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;

  constructor(
    public form: FormBuilder,
    public srv: repoService,
    public router: Router,
    private zone: NgZone
  ) {
    this.onAdd = new EventEmitter();
    this.newUser = form.group({
      name: '',
      email: '',
      password: '',
      img: '',
    });
    this.isLoading = false;
    this.isSuccess = false;
    this.isError = false;
  }

  handleSubmit() {
    this.isLoading = true;
    const sendNewUser: User = {
      name: this.newUser.value.name,
      email: this.newUser.value.email,
      password: this.newUser.value.password,
      img: this.newUser.value.img,
    };
    console.log(sendNewUser);
    this.srv.registerUser(sendNewUser).subscribe({
      next: (response: any) => {
        console.log(response);
        this.onAdd.emit(response.result);
        console.log('user registered');
        this.isLoading = false;
        this.isSuccess = true;
        setTimeout(() => {
          this.isSuccess = false;
          this.zone.run(() => {
            this.router.navigate(['/login']);
          });
        }, 2000);
      },
      error: (error: any) => {
        console.log(error);
        this.isLoading = false;
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
}

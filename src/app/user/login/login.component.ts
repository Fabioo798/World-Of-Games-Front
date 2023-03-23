import { Component, EventEmitter, Output, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User, repoService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: FormGroup;
  @Output() onAdd: EventEmitter<string>;
  token: string;
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
    this.login = form.group({
      email: '',
      password: '',
    });
    this.token = '';
    this.isLoading = false;
    this.isSuccess = false;
    this.isError = false;
  }

  handleSubmit() {
    debugger;
    const sendLogUser: Partial<User> = {
      email: this.login.value.email,
      password: this.login.value.password,
    };
    console.log(sendLogUser);
    console.log(this.srv);
    this.srv.loginUser(sendLogUser).subscribe({
      next: (response: any) => {
        console.log(response);
        console.log('user logged');
        this.token = response.results.token; // Store the token
        this.onAdd.emit(this.token);
        console.log('Token:', this.token);
        localStorage.setItem('token', this.token); // Save the token to the local storage
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
        this.login.reset();
      },
    });
  }

  // loadUsers() {
  //   const headers = { Authorization: `Bearer ${this.token}` };
  //   this.srv.loadUser(headers).subscribe((users: User[]) => {
  //     console.log('Users:', users);
  //   });
  // }
}

import { Component, EventEmitter, Output, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RepoUserService } from 'src/app/services/user/user.service';
import { Login } from 'src/app/types/types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  login: FormGroup;
  @Output() onAdd: EventEmitter<string>;
  isSuccess: boolean;
  isError: boolean;
  constructor(
    public form: FormBuilder,
    public srv: RepoUserService,
    public router: Router,
    public zone: NgZone
  ) {
    this.onAdd = new EventEmitter();
    this.login = form.group({
      email: '',
      password: '',
    });
    this.isSuccess = false;
    this.isError = false;
  }

  async ngOnInit(): Promise<void> {
    this.srv.token$.subscribe();
  }

  handleSubmit() {
    const sendLogUser: Login = {
      email: this.login.value.email,
      password: this.login.value.password,
    };
    this.srv.loginUser(sendLogUser).subscribe({
      next: (response: any) => {
        this.isSuccess = true;
        this.srv.token$.next(response);

        setTimeout(() => {
          this.isSuccess = false;
          this.zone.run(() => {
            this.router.navigate(['/games/']);
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
        this.login.reset();
      },
    });
  }
}

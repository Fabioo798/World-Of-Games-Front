import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type User = {
  name: string;
  email: string;
  password: string;
  img: string;
};

export type apiAnswer = {
  result: any;
};
@Injectable({
  providedIn: 'root',
})
export class RepoUserService {
  private apiUrl = 'http://localhost:4800/users/register';

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<any> {
    return this.http.post('http://localhost:4800/users/register', user);
  }

  loginUser(user: Partial<User>): Observable<any> {
    return this.http.post('http://localhost:4800/users/login', user);
  }
  loadUser(headers?: any): Observable<User[]> {
    const options = { headers };
    return this.http.get<User[]>('http://localhost:4800/users/', options);
  }
}

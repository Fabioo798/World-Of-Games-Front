import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  ServerCompleteUserResponse,
  ServerLoginResponse,
} from 'src/app/types/server.response';
import { LoggedUser, Login, Token, User } from 'src/app/types/types';
import * as jose from 'jose';

export type apiAnswer = {
  result: any;
};
@Injectable({
  providedIn: 'root',
})
export class RepoUserService {
  private apiUrl = 'http://localhost:4800/users';
  token$: BehaviorSubject<string>;
  currentUser$: BehaviorSubject<User>;
  userLogged$: BehaviorSubject<LoggedUser>;

  constructor(private http: HttpClient) {
    const initialToken = '';
    this.token$ = new BehaviorSubject<string>(initialToken);
    this.currentUser$ = new BehaviorSubject<User>({} as User);
    this.userLogged$ = new BehaviorSubject<LoggedUser>({
      id: '',
      email: '',
      role: 'logout',
    } as LoggedUser);
  }

  registerUser(user: User): Observable<any> {
    return this.http.post(this.apiUrl + '/register', user);
  }

  loginUser(user: Login): Observable<string> {
    return (
      this.http.post(
        this.apiUrl + '/login',
        user
      ) as Observable<ServerLoginResponse>
    ).pipe(
      map((data: any) => {
        const token: string = data.results.token;
        console.log(token);
        this.token$.next(token);
        localStorage.setItem('Token', token as string);
        const userInfo = jose.decodeJwt(token) as unknown as LoggedUser;
        this.userLogged$.next(userInfo);
        return token;
      })
    );
  }

  initialToken(): void {
    let token = localStorage.getItem('Token');
    if (!token) token = '';
    this.token$.next(token);
  }
  getCurrentUser(UserId: string): Observable<User> {
    const token = this.token$.value;
    const headers = { Authorization: `Bearer ${token}` }; // Add the token
    return (
      this.http.get(this.apiUrl + '/' + UserId, {
        headers: headers,
        responseType: 'json',
      }) as Observable<ServerCompleteUserResponse>
    ).pipe(
      map((data) => {
        this.currentUser$.next(data.results[0]);
        return data.results[0];
      })
    );
  }

  updateUser(id: string, user: Partial<User>): Observable<any> {
    const updateUser = user;
    const token = this.token$.value;
    const headers = { Authorization: `Bearer ${token}` }; // Add the token to headers
    return this.http.put(this.apiUrl + '/' + id, updateUser,  {
      headers: headers,
    });
  }
  deleteUser(id: string): Observable<any> {
    const token = this.token$.value;
    const headers = { Authorization: `Bearer ${token}` }; // Add the token to headers
    return this.http.delete(this.apiUrl + '/' + id, {
      headers: headers,
    });
  }
}

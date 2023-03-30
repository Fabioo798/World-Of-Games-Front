import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { Game, Token } from 'src/app/types/types';
import { RepoUserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class RepoGameService {
  private apiUrl = 'https://wog-backend.onrender.com/games/';
  public _games$: BehaviorSubject<Game[]>;
  token: Token;
  gameInfo$: BehaviorSubject<Game>;

  constructor(public http: HttpClient, public srv: RepoUserService) {
    const initialGames: Game[] = [];
    this._games$ = new BehaviorSubject(initialGames);
    this.token = { results: { token: '' } };
    this.gameInfo$ = new BehaviorSubject({} as Game);
  }

  public get games$(): Observable<Game[]> {
    return this._games$.asObservable();
  }

  createGame(game: Game): Observable<any> {
    return this.srv.token$.pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post(this.apiUrl, game, {
          headers,
        });
      })
    );
  }

  loadGame(id: string): Observable<any> {
    return this.http.get(this.apiUrl + id);
  }

  public loadAllGame(): Observable<Game[]> {
    return this.srv.token$.pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` }; // Add the token to headers
        return this.http
          .get<{ results: Array<Game[]> }>(this.apiUrl, {
            headers: headers,
          })
          .pipe(
            map((t) => {
              this._games$.next(t.results[0]);
              return t.results[0];
            })
          );
      })
    );
  }

  queryGame(category: string): Observable<any> {
    let allGames: any;
    return this.srv.token$.pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` }; // Add the token to headers
        if (category === 'all' || category === '') {
          allGames = this.http.get<{ results: Array<Game[]> }>(this.apiUrl, {
            headers: headers,
          });
        } else {
          allGames = this.http.get<{ results: Array<Game[]> }>(
            this.apiUrl + `filter/${category}`,
            { headers: headers }
          );
        }
        return allGames.pipe(
          map((t: any) => {
            this._games$.next(t.results[0]);
            return t.results[0];
          })
        );
      })
    );
  }
  updateGame(id: string, game: Game): Observable<any> {
    return this.srv.token$.pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` }; // Add the token to headers
        const updateGame = game;
        return this.http.put(this.apiUrl + id, updateGame, {
          headers: headers,
        });
      })
    );
  }
  deleteGame(id: string): Observable<any> {
    return this.srv.token$.pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` }; // Add the token to headers
        return this.http.delete(this.apiUrl + id, {
          headers: headers,
        });
      })
    );
  }
}

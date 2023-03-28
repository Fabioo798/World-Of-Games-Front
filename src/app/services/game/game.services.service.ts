import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { Game, Token } from 'src/app/types/types';
import { RepoUserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class RepoGameService {
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
        return this.http.post('http://localhost:4800/games/', game, {
          headers,
        });
      })
    );
  }

  loadGame(id: string): Observable<any> {
    return this.http.get(`http://localhost:4800/games/:${id}`);
  }

  public loadAllGame(): Observable<Game[]> {
    return this.srv.token$.pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` }; // Add the token to headers
        return this.http
          .get<{ results: Array<Game[]> }>('http://localhost:4800/games/', {
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
          allGames = this.http.get<{ results: Array<Game[]> }>(
            'http://localhost:4800/games/',
            { headers: headers }
          );
        } else {
          console.log(category);
          allGames = this.http.get<{ results: Array<Game[]> }>(
            `http://localhost:4800/games/filter/${category}`,
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
        return this.http.put(`http://localhost:4800/games/${id}`, updateGame, {
          headers: headers,
        });
      })
    );
  }
  deleteGame(id: string): Observable<any> {
    return this.srv.token$.pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` }; // Add the token to headers
        return this.http.delete(`http://localhost:4800/games/${id}`, {
          headers: headers,
        });
      })
    );
  }
}

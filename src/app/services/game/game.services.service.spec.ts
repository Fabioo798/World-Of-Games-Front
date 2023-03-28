import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RepoGameService } from './game.services.service';
import { Game } from 'src/app/types/types';
import { RepoUserService } from '../user/user.service';
import { of } from 'rxjs';

describe('GameServicesService', () => {
  let service: RepoGameService;
  let httpMock: HttpTestingController;
  let userSrv: RepoUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepoGameService, RepoUserService],
    });
    service = TestBed.inject(RepoGameService);
    httpMock = TestBed.inject(HttpTestingController);
    userSrv = TestBed.inject(RepoUserService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('CreateGame', () => {
    it('should create a new game', () => {
      const game = {
        id: 'test',
        gameName: 'test',
        category: 'MMO',
        releaseDate: 'test',
        description: 'test',
        img: '',
        price: 25,
      } as Game;

      service.createGame(game).subscribe((result) => {
        expect(result).toBeDefined();
      });

      const req = httpMock.expectOne('http://localhost:4800/games/');
      expect(req.request.method).toEqual('POST');
      req.flush({ result: true });
    });
  });

  describe('loadGame', () => {
    it('should load Game data', () => {
      const id = 'test';

      service.loadGame(id).subscribe((games) => {
        expect(games.length).toBeGreaterThan(0);
      });

      const req = httpMock.expectOne(`http://localhost:4800/games/:${id}`);
      expect(req.request.method).toEqual('GET');
      req.flush([
        {
          id: 'test',
          gameName: 'test',
          category: 'MMO',
          releaseDate: 'test',
          description: 'test',
          img: '',
          price: 25,
        },
      ]);
    });
  });
  describe('loadAllGame', () => {
    it('should load Game data', () => {
      const testData = [
        {
          id: 'test',
          gameName: 'test',
          category: 'MMO',
          releaseDate: 'test',
          description: 'test',
          img: '',
          price: 25,
        },
      ] as unknown as Game[];

      service.loadAllGame().subscribe((games) => {
        expect(games).not.toBeNull();
      });

      const req = httpMock.expectOne('http://localhost:4800/games/');
      expect(req.request.method).toEqual('GET');
      req.flush({ results: testData });
    });
  });

  describe('queryGame', () => {
    it('should query Game data per category', () => {
      const category = 'MMO';

      service.queryGame(category).subscribe((games) => {
        expect(games.length).not.toBeNull();
      });

      const req = httpMock.expectOne(
        `http://localhost:4800/games/filter/${category}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        results: [
          {
            id: 'test',
            gameName: 'test',
            category: 'MMO',
            releaseDate: 'test',
            description: 'test',
            img: '',
            price: 25,
          },
        ],
      });
    });
    it('should query  all Game data', () => {
      const category = 'all';

      service.queryGame(category).subscribe((games) => {
        expect(games.length).not.toBeNull();
      });

      const req = httpMock.expectOne(`http://localhost:4800/games/`);
      expect(req.request.method).toEqual('GET');
      req.flush({
        results: [
          {
            id: 'test',
            gameName: 'test',
            category: 'MMO',
            releaseDate: 'test',
            description: 'test',
            img: '',
            price: 25,
          },
        ],
      });
    });
  });

  describe('updateGame', () => {
    it('should update Game data', () => {
      const id = 'test';
      const game = {
        id: 'test',
        gameName: 'test',
        category: 'MMO',
        releaseDate: 'test',
        description: 'test',
        img: '',
        price: 25,
      } as Game;

      service.updateGame(id, game).subscribe((games) => {
        expect(games.length).toBeGreaterThan(0);
      });

      const req = httpMock.expectOne(`http://localhost:4800/games/${id}`);
      expect(req.request.method).toEqual('PUT');
      req.flush([
        {
          id: 'test',
          gameName: 'test',
          category: 'MMO',
          releaseDate: 'test',
          description: 'test',
          img: '',
          price: 25,
        },
      ]);
    });
  });
  describe('deleteGame', () => {
    it('should delete Game data', () => {
      const id = 'test';

      service.deleteGame(id).subscribe((games) => {
        expect(games.length).toBeGreaterThan(0);
      });

      const req = httpMock.expectOne(`http://localhost:4800/games/${id}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush([
        {
          id: 'test',
          gameName: 'test',
          category: 'MMO',
          releaseDate: 'test',
          description: 'test',
          img: '',
          price: 25,
        },
      ]);
    });
  });

  it('should return an observable of games', () => {
    const testData = [
      {
        id: 'test',
        gameName: 'test',
        category: 'MMO',
        releaseDate: 'test',
        description: 'test',
        img: '',
        price: 25,
      },
      {
        id: 'test',
        gameName: 'test',
        category: 'MMO',
        releaseDate: 'test',
        description: 'test',
        img: '',
        price: 25,
      },
    ] as unknown as Game[];
    service._games$.next(testData);
    service.games$.subscribe((emittedGames) => {
      expect(emittedGames).toEqual(testData);
    });
  });
});

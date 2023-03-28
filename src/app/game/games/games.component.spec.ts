import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Game } from 'src/app/types/types';
import { GamesComponent } from './games.component';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { RepoUserService } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from 'src/app/user/cart/cart.component';
import {
  mockGame,
  mockGameService,
  mockUser,
  mockUserService,
} from 'src/app/utils/mocks';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

describe('GamesComponent', () => {
  let component: GamesComponent;
  let fixture: ComponentFixture<GamesComponent>;
  let gamesrv: RepoGameService;
  let srv: RepoUserService;
  let router: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: 'cart', component: CartComponent },
        ]),
      ],
      declarations: [GamesComponent],
      providers: [
        { provide: RepoGameService, useValue: mockGameService },
        { provide: RepoUserService, useValue: mockUserService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesComponent);
    component = fixture.componentInstance;
    srv = TestBed.inject(RepoUserService);
    gamesrv = TestBed.inject(RepoGameService);
    fixture.detectChanges();
    component.currentUser$ = of(mockUser);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('when ngoninit method is called', () => {
    it('Then if token is not empty it should not load games', () => {
      srv.token$.next(null as any);
      const spyRoute = spyOn(component.zone, 'run').and.callThrough();
      component.ngOnInit();

      expect(spyRoute).toHaveBeenCalled();
    });
  });

  describe('onCategorySelect()', () => {
    it('should call loadGames()', () => {
      spyOn(component, 'loadGames');
      component.onCategorySelect();
      expect(component.loadGames).toHaveBeenCalled();
    });
  });

  describe('loadGames()', () => {
    it('should update the games property', () => {
      const games: Game[] = [
        { id: '1', gameName: 'Game 1', category: 'MMO' } as Game,
        { id: '2', gameName: 'Game 2', category: 'Action' } as Game,
      ];
      const spyOnGame = spyOn(gamesrv, 'queryGame').and.returnValue(of(games));

      component.loadGames();
      expect(component.games).toEqual(games);
    });
  });

  describe('addCart()', () => {
    it('should call the updateUser() method of the user service', () => {
      srv.currentUser$.next(mockUser);
      const spyUpUser = spyOn(srv, 'updateUser').and.returnValue(of(mockUser));
      const spyZone = spyOn(component.zone, 'run').and.callThrough();

      component.addCart(mockGame);

      expect(spyUpUser).toHaveBeenCalled();
      expect(spyZone).toHaveBeenCalled();
    });
  });
});

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { RepoUserService } from 'src/app/services/user/user.service';
import {
  mockUserService,
  mockGameService,
  mockGame,
  mockUser,
} from 'src/app/utils/mocks';

import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let srv: RepoUserService;
  let gamesrv: RepoGameService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      providers: [
        { provide: RepoUserService, useValue: mockUserService },
        { provide: RepoGameService, useValue: mockGameService },
      ],
      imports: [HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    srv = TestBed.inject(RepoUserService);
    gamesrv = TestBed.inject(RepoGameService);
    fixture.detectChanges();
    component.currentUser$ = of(mockUser);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given the removeCart method', () => {
    it('Then it should call updatUser with the updated cart', () => {
      srv.currentUser$.next(mockUser);
      const spyUpUser = spyOn(srv, 'updateUser').and.returnValue(of(mockUser));
      const spyZone = spyOn(component.zone, 'run').and.callThrough();

      component.removeGame(mockGame);

      expect(spyUpUser).toHaveBeenCalled();
      expect(spyZone).toHaveBeenCalled();
    });
  });
});

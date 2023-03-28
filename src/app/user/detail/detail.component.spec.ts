import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepoUserService } from 'src/app/services/user/user.service';

import { UserDetailComponent } from './detail.component';
import { HttpClientModule } from '@angular/common/http';
import {
  mockGame,
  mockGameService,
  mockRouteParam,
  mockUser,
  mockUserService,
} from 'src/app/utils/mocks';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from '../register/register.component';
import { AddComponent } from 'src/app/game/add/add.component';
import { ActivatedRoute } from '@angular/router';

describe('DetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let srv: RepoUserService;
  let gamesrv: RepoGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      providers: [
        { provide: RepoUserService, useValue: mockUserService },
        { provide: RepoGameService, useValue: mockGameService },
        { provide: ActivatedRoute, useValue: mockRouteParam },
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: 'register', component: RegisterComponent },
          { path: 'create', component: AddComponent },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    srv = TestBed.inject(RepoUserService);
    gamesrv = TestBed.inject(RepoGameService);
    fixture.detectChanges();
  });

  it('should create with the current users datas', () => {
    expect(component).toBeTruthy();
  });

  describe('When editGame is called', () => {
    it('should call editGame and navigate to create', () => {
      const spyZoneRun = spyOn(component.zone, 'run').and.callThrough();

      component.editGame(mockGame);

      expect(spyZoneRun).toHaveBeenCalled();
    });
  });
  describe('When editUser is called', () => {
    it('should call editUser and navigate to create', () => {
      const spyZoneRun = spyOn(component.zone, 'run').and.callThrough();

      component.editUser();

      expect(spyZoneRun).toHaveBeenCalled();
    });
  });
  describe('When deleteGame is called', () => {
    it('should call deleteGame', () => {
      const spyOnGame = spyOn(gamesrv, 'deleteGame').and.callThrough();
      component.deleteGame(mockUser.id as any);

      expect(spyOnGame).toHaveBeenCalled();
    });
  });
  describe('When deleteGame is called', () => {
    it('should call deleteGame', () => {
      const spyOnUser = spyOn(srv, 'deleteUser').and.callThrough();
      component.deleteUser(mockUser.id as any);

      expect(spyOnUser).toHaveBeenCalled();
    });
  });
});

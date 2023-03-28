import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { GamesComponent } from 'src/app/game/games/games.component';
import { RepoUserService } from 'src/app/services/user/user.service';
import { mockUserService, mockToken } from 'src/app/utils/mocks';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let srv: RepoUserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'games', component: GamesComponent },
        ]),
      ],
      providers: [
        {
          provide: RepoUserService,
          useValue: mockUserService,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    srv = TestBed.inject(RepoUserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given the handleSubmit method', () => {
    describe('When called with correct data', () => {
      it('Should call the users login service and next', fakeAsync(() => {
        component.login.value['email'] = 'TestMail';
        component.login.value['password'] = 'TestPass';
        const spyLogin = spyOn(srv, 'loginUser').and.returnValue(of(mockToken));
        const spyZoneRun = spyOn(component.zone, 'run').and.callThrough();
        component.handleSubmit();
        tick(2000);
        expect(spyLogin).toHaveBeenCalled();
        expect(spyZoneRun).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
        expect(component.router.url).toBe('/games');
      }));
    });

    describe('When called with incorrect data', () => {
      it('Should call the aikidoUsers login service and return', fakeAsync (() => {
        const spyLogin = spyOn(srv, 'loginUser').and.returnValue(
          throwError(() => 'error')
        );
        component.handleSubmit();
        tick(3000);
        expect(spyLogin).toHaveBeenCalled();
        expect(component.isError).toBeFalse();
      }));
    });
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { UserDetailComponent } from 'src/app/user/detail/detail.component';
import { mockGameService, mockToken, mockUser } from 'src/app/utils/mocks';

import { AddComponent } from './add.component';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let srv: RepoGameService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'user/:id', component: UserDetailComponent },
        ]),
      ],
      providers: [
        {
          provide: RepoGameService,
          useValue: mockGameService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    srv = TestBed.inject(RepoGameService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given the handleSubmit method', () => {
    describe('When called with correct data', () => {
      it('Should call the RepoGameService service and next', fakeAsync(() => {
        component.newGame.value['gameName'] = 'TestName';
        component.newGame.value['releaseDate'] = 'TestReleaseDate';
        component.newGame.value['category'] = 'TestCategory';
        component.newGame.value['price'] = 'TestPrice';
        component.newGame.value['description'] = 'TestDescription';
        component.newGame.value['img'] = 'TestImg';
        const spynewGame = spyOn(srv, 'createGame').and.returnValue(
          of(mockUser)
        );
        const spyZoneRun = spyOn(component.zone, 'run').and.callThrough();
        component.handleSubmit();
        tick(2000);
        expect(spynewGame).toHaveBeenCalled();
        expect(spyZoneRun).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
        expect(component.router.url).toBe('/user/:id');
      }));
    });

    describe('When the createGame method returns an error', () => {
      it('Should display error message', fakeAsync(() => {
        component.newGame.value['gameName'] = 'TestName';
        component.newGame.value['releaseDate'] = 'TestReleaseDate';
        component.newGame.value['category'] = 'TestCategory';
        component.newGame.value['price'] = 'TestPrice';
        component.newGame.value['description'] = 'TestDescription';
        component.newGame.value['img'] = 'TestImg';
        const errorResponse = { error: { message: 'Error message' } };
        spyOn(srv, 'createGame').and.returnValue(throwError(() => 'error'));
        component.handleSubmit();
        tick(2000);
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
      }));
    });
  });
});

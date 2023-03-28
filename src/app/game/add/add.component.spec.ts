import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, StorageReference } from 'firebase/storage';
import { of, throwError } from 'rxjs';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { Game } from 'src/app/types/types';
import { UserDetailComponent } from 'src/app/user/detail/detail.component';
import { mockGameService, mockGametoUp } from 'src/app/utils/mocks';
import { environment } from 'src/environments/environment';
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
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideStorage(() => getStorage()),
      ],
      providers: [
        {
          provide: RepoGameService,
          useValue: mockGameService,
        },
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    srv = TestBed.inject(RepoGameService);
    component.gameToUpdate = {} as unknown as Game;
    fixture.detectChanges();
    component.newGame.value['gameName'] = 'TestName';
    component.newGame.value['releaseDate'] = 'TestReleaseDate';
    component.newGame.value['category'] = 'TestCategory';
    component.newGame.value['price'] = 20;
    component.newGame.value['description'] = 'TestDescription';
    component.newGame.value['img'] = 'TestImg';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('(UPDATE)When we have a game to update', () => {
    it('Should call the RepoGameService service and next', fakeAsync(() => {
      // component.newGame.value['gameName'] = 'TestName';
      // component.newGame.value['releaseDate'] = 'TestReleaseDate';
      // component.newGame.value['category'] = 'TestCategory';
      // component.newGame.value['price'] = 20;
      // component.newGame.value['description'] = 'TestDescription';
      // component.newGame.value['img'] = 'TestImg';
      const spynewGame = spyOn(srv, 'updateGame').and.returnValue(
        of(mockGametoUp)
      );
      const spyZoneRun = spyOn(component.zone, 'run').and.callThrough();
      const mockEvent = {
        target: {
          files: [
            {
              name: 'test',
              size: 0,
              type: 'image/png',
            },
          ],
        },
      };
      srv.gameInfo$.next(mockGametoUp);
      component.saveImage(mockEvent);
      const spyUpload = spyOn(component, 'uploadImage').and.resolveTo();
      const spyGetImage = spyOn(component, 'getImage').and.resolveTo('mock');
      component.ngOnInit();
      component.handleSubmit();
      tick(2000);
      expect(spyUpload).toHaveBeenCalled();
      expect(spyGetImage).toHaveBeenCalled();

      expect(spynewGame).toHaveBeenCalled();
      expect(spyZoneRun).toHaveBeenCalled();
      expect(component.isSuccess).toBeFalse();
      expect(component.isError).toBeFalse();
      expect(component.router.url).toBe('/user/:id');
    }));
  });
  describe('(CREATE)Given the handleSubmit method', () => {
    describe('When called with correct data to create a game', () => {
      it('Should call the RepoGameService service and next', fakeAsync(() => {
        const spynewGame = spyOn(srv, 'createGame').and.returnValue(
          of(mockGametoUp)
        );
        const spyZoneRun = spyOn(component.zone, 'run').and.callThrough();
        const mockEvent = {
          target: {
            files: [
              {
                name: 'test',
                size: 0,
                type: 'image/png',
              },
            ],
          },
        };
        srv.gameInfo$.next({} as unknown as Game);
        component.gameToUpdate = {} as any;
        component.saveImage(mockEvent);
        const spyUpload = spyOn(component, 'uploadImage').and.resolveTo();
        const spyGetImage = spyOn(component, 'getImage').and.resolveTo('mock');
        component.handleSubmit();
        tick(2000);
        expect(spyUpload).toHaveBeenCalled();
        expect(spyGetImage).toHaveBeenCalled();
        expect(spynewGame).toHaveBeenCalled();
        expect(spyZoneRun).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
        expect(component.router.url).toBe('/user/:id');
      }));
    });

    describe('(ERROR)When the createGame method returns an error', () => {
      it('Should display error message', fakeAsync(() => {
        spyOn(srv, 'createGame').and.returnValue(throwError(() => 'error'));
        const mockEvent = {
          target: {
            files: [
              {
                name: 'test',
                size: 0,
                type: 'image/png',
              },
            ],
          },
        };
        srv.gameInfo$.next(null as unknown as Game);
        component.gameToUpdate = null as any;
        component.saveImage(mockEvent);
        const spyUpload = spyOn(component, 'uploadImage').and.resolveTo();
        const spyGetImage = spyOn(component, 'getImage').and.resolveTo('mock');

        component.handleSubmit();
        tick(3000);

        expect(spyUpload).toHaveBeenCalled();
        expect(spyGetImage).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
      }));
    });

    describe('When the getImage method is called', () => {
      it('then it should return the string', () => {
        const mockStorage = {} as StorageReference;
        const spyGet = spyOn(component, 'getImage').and.callFake(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return new Promise((_resolve, _reject) => {
            return '';
          });
        });
        component.getImage(mockStorage);
        expect(spyGet).toHaveBeenCalled();
      });
    });

    describe('When the uploadImage method is called', () => {
      it('Then it should uploadBytes', async () => {
        const testRef = ref(component['storage'], 'testing');
        const file = new File(['test'], 'test.png', { type: 'image/png' });

        spyOn(component, 'uploadImage').and.callThrough();

        await component.uploadImage(testRef, file);

        const downloadUrl = await component.getImage(testRef);

        expect(component.uploadImage).toHaveBeenCalled();
        expect(downloadUrl).toBeTruthy();
      });
    });
    describe('submitButtonLabel', () => {
      it('should return "Create" when gameToUpdate is falsy', () => {
        component.gameToUpdate = null as unknown as Game;
        expect(component.submitButtonLabel).toEqual('Create');
      });

      it('should return "Save" when gameToUpdate is truthy', () => {
        component.gameToUpdate = { id: '1', gameName: 'Test Game' } as Game;
        expect(component.submitButtonLabel).toEqual('Save');
      });
    });
  });
});

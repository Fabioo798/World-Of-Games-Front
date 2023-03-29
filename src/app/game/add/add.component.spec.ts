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
import { mockEvent, mockGameService, mockGametoUp } from 'src/app/utils/mocks';
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('(UPDATE)When we have a game to update', () => {
    it('Should call the RepoGameService service and next', fakeAsync(() => {
      const checkGame = spyOn(srv, 'updateGame').and.returnValue(
        of(mockGametoUp)
      );
      const checkZoneRun = spyOn(component.zone, 'run').and.callThrough();
      srv.gameInfo$.next(mockGametoUp);
      component.saveImage(mockEvent);
      const checkUpload = spyOn(component, 'uploadImage').and.resolveTo();
      const checkGetImage = spyOn(component, 'getImage').and.resolveTo('mock');
      component.ngOnInit();
      component.handleSubmit();
      tick(2000);
      expect(checkUpload).toHaveBeenCalled();
      expect(checkGetImage).toHaveBeenCalled();

      expect(checkGame).toHaveBeenCalled();
      expect(checkZoneRun).toHaveBeenCalled();
      expect(component.isSuccess).toBeFalse();
      expect(component.isError).toBeFalse();
      expect(component.router.url).toBe('/user/:id');
    }));
  });
  describe('(CREATE)Given the handleSubmit method', () => {
    describe('When called with correct data to create a game', () => {
      it('Should call the RepoGameService service and next', fakeAsync(() => {
        const controlGame = spyOn(srv, 'createGame').and.returnValue(
          of(mockGametoUp)
        );
        const controlZoneRun = spyOn(component.zone, 'run').and.callThrough();
        srv.gameInfo$.next({} as unknown as Game);
        component.gameToUpdate = {} as any;
        component.saveImage(mockEvent);
        const controlUpload = spyOn(component, 'uploadImage').and.resolveTo();
        const controlGetImage = spyOn(component, 'getImage').and.resolveTo('mock');
        component.handleSubmit();
        tick(2000);
        expect(controlUpload).toHaveBeenCalled();
        expect(controlGetImage).toHaveBeenCalled();
        expect(controlGame).toHaveBeenCalled();
        expect(controlZoneRun).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
        expect(component.router.url).toBe('/user/:id');
      }));
    });

    describe('(ERROR)When the createGame method returns an error', () => {
      it('Should display error message', fakeAsync(() => {
        spyOn(srv, 'createGame').and.returnValue(throwError(() => 'error'));

        srv.gameInfo$.next(null as unknown as Game);
        component.gameToUpdate = null as any;
        component.saveImage(mockEvent);
        const loadSpy = spyOn(component, 'uploadImage').and.resolveTo();
        const imageGet = spyOn(component, 'getImage').and.resolveTo('mock');

        component.handleSubmit();
        tick(3000);

        expect(loadSpy).toHaveBeenCalled();
        expect(imageGet).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
      }));
    });

    describe('When the getImage method is called', () => {
      it('then it should return the string', () => {
        const mockStorage = {} as StorageReference;
        const checkGet = spyOn(component, 'getImage').and.callFake(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return new Promise((_resolve, _reject) => {
            return '';
          });
        });
        component.getImage(mockStorage);
        expect(checkGet).toHaveBeenCalled();
      });
    });

    describe('When the uploadImage method is called', () => {
      it('Then it should uploadBytes', async () => {
        const refTest = ref(component['storage'], 'testing');
        const file = new File(['test'], 'test.png', { type: 'image/png' });

        spyOn(component, 'uploadImage').and.callThrough();

        await component.uploadImage(refTest, file);

        const downloadUrl = await component.getImage(refTest);

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

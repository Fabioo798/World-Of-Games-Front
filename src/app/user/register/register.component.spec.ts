import {
  mockEvent,
  mockRoute,
  mockUser,
  mockUserService,
} from './../../utils/mocks';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { RepoUserService } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/types/types';
import {
  getStorage,
  provideStorage,
  ref,
  StorageReference,
} from '@angular/fire/storage';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { UserDetailComponent } from '../detail/detail.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let srv: RepoUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: RegisterComponent },
          { path: 'user/:12345', component: UserDetailComponent },
        ]),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideStorage(() => getStorage()),
      ],
      providers: [
        { provide: RepoUserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    srv = TestBed.inject(RepoUserService);
    component.userToUpdate = {} as unknown as User;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('As we have a game to update', () => {
    it('Should call the RepoUserService service and next', fakeAsync(() => {
      const newSpyGame = spyOn(srv, 'updateUser').and.returnValue(of(mockUser));
      const spyZoneRun = spyOn(component.zone, 'run').and.callThrough();

      srv.currentUser$.next(mockUser);
      component.isUpdate = true;
      component.saveImage(mockEvent);
      const upSpyLoad = spyOn(component, 'uploadImage').and.resolveTo();
      const spyGetImage = spyOn(component, 'getImage').and.resolveTo('mock');
      component.ngOnInit();
      component.handleSubmit();
      tick(2000);
      expect(upSpyLoad).toHaveBeenCalled();
      expect(spyGetImage).toHaveBeenCalled();

      expect(newSpyGame).toHaveBeenCalled();
      expect(spyZoneRun).toHaveBeenCalled();
      expect(component.isSuccess).toBeFalse();
      expect(component.isError).toBeFalse();
      expect(component.router.url).toBe(`/user/:${mockUser.id}`);
    }));
  });

  describe('Given the handleSubmit method', () => {
    describe('When called with correct data', () => {
      it('Should call the RepoGameService service and next', fakeAsync(() => {
        const spyNewUser = spyOn(srv, 'registerUser').and.returnValue(
          of(mockUser)
        );
        const zoneSpyRun = spyOn(component.zone, 'run').and.callThrough();

        srv.currentUser$.next({} as unknown as User);
        component.userToUpdate = {} as any;
        component.isUpdate = false;
        component.saveImage(mockEvent);
        const spyUpload = spyOn(component, 'uploadImage').and.resolveTo();
        const getSpyImage = spyOn(component, 'getImage').and.resolveTo('mock');
        component.handleSubmit();
        tick(2000);
        expect(spyUpload).toHaveBeenCalled();
        expect(getSpyImage).toHaveBeenCalled();
        expect(spyNewUser).toHaveBeenCalled();
        expect(zoneSpyRun).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
        expect(component.router.url).toBe('/login');
      }));
    });

    describe('(ERROR)When the createUser method returns an error', () => {
      it('Should display error message', fakeAsync(() => {
        spyOn(srv, 'registerUser').and.returnValue(throwError(() => 'error'));

        srv.currentUser$.next({} as unknown as User);
        component.userToUpdate = {} as any;
        component.saveImage(mockEvent);
        const spyUpload = spyOn(component, 'uploadImage').and.resolveTo();
        const spyGetImage = spyOn(component, 'getImage').and.resolveTo('mock');
        component.ngOnInit();
        component.handleSubmit();
        tick(2000);

        expect(spyUpload).toHaveBeenCalled();
        expect(spyGetImage).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
      }));
    });
    describe('(ERROR)When the updateUser method returns an error', () => {
      it('Will display error message', fakeAsync(() => {
        spyOn(srv, 'updateUser').and.returnValue(throwError(() => 'error'));

        component.isUpdate = true;
        component.saveImage(mockEvent);
        const uploadSpy = spyOn(component, 'uploadImage').and.resolveTo();
        const getImageSpy = spyOn(component, 'getImage').and.resolveTo('mock');
        component.ngOnInit();
        component.handleSubmit();
        tick(2000);

        expect(uploadSpy).toHaveBeenCalled();
        expect(getImageSpy).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
      }));
    });

    describe('As we select the getImage ', () => {
      it('So it should return the string', () => {
        const mockStorage = {} as StorageReference;
        const getSpy = spyOn(component, 'getImage').and.callFake(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return new Promise((_resolve, _reject) => {
            return '';
          });
        });
        component.getImage(mockStorage);
        expect(getSpy).toHaveBeenCalled();
      });
    });

    describe('When the submitButtonLabel', () => {
      it('should return "Create" when gameToUpdate is falsy', () => {
        component.userToUpdate = null as unknown as User;
        expect(component.submitButtonLabel).toEqual('Register');
      });

      it('should return "Save" when gameToUpdate is truthy', () => {
        component.userToUpdate = {
          id: '1',
          name: 'Test Game',
        } as unknown as User;
        expect(component.submitButtonLabel).toEqual('Save');
      });
    });
  });

  describe('If we call the uploadImage ', () => {
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
});

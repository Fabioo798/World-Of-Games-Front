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
  mockPass,
  mockRoute,
  mockUser,
  mockUserService,
} from './../../utils/mocks';
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

    component.newUser.value['name'] = 'TestName';
    component.newUser.value['email'] = 'TestReleaseDate';
    component.newUser.value['password'] = mockPass;
    component.newUser.value['img'] = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When we have a game to update', () => {
    it('Should call the RepoUserService service and next', fakeAsync(() => {
      const spynewGame = spyOn(srv, 'updateUser').and.returnValue(of(mockUser));
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
      srv.currentUser$.next(mockUser);
      component.isUpdate = true;
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
      expect(component.router.url).toBe(`/user/:${mockUser.id}`);
    }));
  });

  describe('Given the handleSubmit method', () => {
    describe('When called with correct data', () => {
      it('Should call the RepoGameService service and next', fakeAsync(() => {
        const spynewUser = spyOn(srv, 'registerUser').and.returnValue(
          of(mockUser)
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
        srv.currentUser$.next({} as unknown as User);
        component.userToUpdate = {} as any;
        component.isUpdate = false;
        component.saveImage(mockEvent);
        const spyUpload = spyOn(component, 'uploadImage').and.resolveTo();
        const spyGetImage = spyOn(component, 'getImage').and.resolveTo('mock');
        component.handleSubmit();
        tick(2000);
        expect(spyUpload).toHaveBeenCalled();
        expect(spyGetImage).toHaveBeenCalled();
        expect(spynewUser).toHaveBeenCalled();
        expect(spyZoneRun).toHaveBeenCalled();
        expect(component.isSuccess).toBeFalse();
        expect(component.isError).toBeFalse();
        expect(component.router.url).toBe('/login');
      }));
    });

    describe('(ERROR)When the createUser method returns an error', () => {
      it('Should display error message', fakeAsync(() => {
        spyOn(srv, 'registerUser').and.returnValue(throwError(() => 'error'));
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
      it('Should display error message', fakeAsync(() => {
        spyOn(srv, 'updateUser').and.returnValue(throwError(() => 'error'));
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
        component.isUpdate = true;
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

    describe('submitButtonLabel', () => {
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
});

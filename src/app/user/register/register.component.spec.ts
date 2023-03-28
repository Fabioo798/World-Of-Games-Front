import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { async, of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { RepoUserService } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/types/types';
import {
  mockRoute,
  mockUser,
  mockUser1,
  mockUserService,
} from './../../utils/mocks';
import {
  getStorage,
  provideStorage,
  ref,
  Storage,
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
  let router: ActivatedRoute;
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

  describe('When we have a game to update', () => {
    it('Should call the RepoUserService service and next', fakeAsync(() => {
      component.newUser.value['name'] = 'TestName';
      component.newUser.value['email'] = 'TestReleaseDate';
      component.newUser.value['password'] = 'TestCategory';
      component.newUser.value['img'] = 'TestImg';
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
        component.newUser.value['name'] = 'TestName';
        component.newUser.value['email'] = 'TestReleaseDate';
        component.newUser.value['password'] = 'TestCategory';
        component.newUser.value['img'] = 'TestImg';
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

    describe('When the createUser method returns an error', () => {
      it('Should display error message', fakeAsync(() => {
        component.newUser.value['UserName'] = 'TestName';
        component.newUser.value['releaseDate'] = 'TestReleaseDate';
        component.newUser.value['category'] = 'TestCategory';
        component.newUser.value['price'] = 'TestPrice';
        component.newUser.value['description'] = 'TestDescription';
        component.newUser.value['img'] = 'TestImg';
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

  //   it('should call registerUser on form submission', fakeAsync(() => {
  //     // Arrange

  //     // mockRepoService.registerUser.and.returnValue(of({ result: mockUser1 }));
  //     spyOn(component.router, 'navigate');
  //     // Act
  //     component.newUser.controls['name'].setValue(mockUser1.name);
  //     component.newUser.controls['email'].setValue(mockUser1.email);
  //     component.newUser.controls['password'].setValue(mockUser1.password);
  //     const mockEvent = {
  //       target: {
  //         files: [
  //           {
  //             name: 'test',
  //             size: 0,
  //             type: 'image/png',
  //           },
  //         ],
  //       },
  //     };

  //     component.saveImage(mockEvent);

  //     const spyUpload = spyOn(component, 'uploadImage').and.resolveTo();
  //     const spyGetImage = spyOn(component, 'getImage').and.resolveTo('mock');
  //     component.handleSubmit();
  //     tick(3000);
  //     // Assert
  //     expect(spyUpload).toHaveBeenCalled();
  //     expect(spyGetImage).toHaveBeenCalled();
  //     // expect(mockRepoService.registerUser).toHaveBeenCalledWith(mockUser1);
  //     expect(component.router.navigate).toHaveBeenCalled();
  //     expect(component.isSuccess).toBeFalsy();
  //   }));
  //   it('should set isError to true when registerUser returns an error', fakeAsync(() => {
  //     // Arrange

  //     // mockRepoService.registerUser.and.returnValue(
  //       throwError(() => 'Error registering user')
  //     );

  //     // Act
  //     component.newUser.controls['name'].setValue(mockUser.name);
  //     component.newUser.controls['email'].setValue(mockUser.email);
  //     component.newUser.controls['password'].setValue(mockUser.password);
  //     component.handleSubmit();
  //     tick(3000);

  //     // Assert
  //     expect(component.isError).toBe(false);
  //   }));

  //   describe('When the getImage method is called', () => {
  //     it('then it should return the string', () => {
  //       const mockStorage = {} as StorageReference;
  //       const spyGet = spyOn(component, 'getImage').and.callFake(() => {
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         return new Promise((_resolve, _reject) => {
  //           return '';
  //         });
  //       });
  //       component.getImage(mockStorage);
  //       expect(spyGet).toHaveBeenCalled();
  //     });
  //   });

  //   describe('When the uploadImage method is called', () => {
  //     it('Then it should uploadBytes', async () => {
  //       const testRef = ref(component['storage'], 'testing');
  //       const file = new File(['test'], 'test.png', { type: 'image/png' });

  //       spyOn(component, 'uploadImage').and.callThrough();

  //       await component.uploadImage(testRef, file);

  //       const downloadUrl = await component.getImage(testRef);

  //       expect(component.uploadImage).toHaveBeenCalled();
  //       expect(downloadUrl).toBeTruthy();
  //     });
  //   });

  //   describe('And there is no age nor time practicing', () => {
  //     it('Then it should call service.register', () => {
  //       component.newUser.setValue({
  //         name: 'TestName',
  //         email: 'TestLast',
  //         password: 'test',
  //         img: 'test',
  //       });

  //       const spyUpload = spyOn(component, 'uploadImage');

  //       component.handleSubmit();

  //       expect(spyUpload).not.toHaveBeenCalled();
  //     });
  //   });
});

import { HttpHeaders } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  mockLogin,
  mockResp,
  mockResp1,
  mockResp2,
  mockToken,
  mockUser,
  mockUser1,
  mockUser3,
  TestApiUserUrl,
} from 'src/app/utils/mocks';
import { RepoUserService } from './user.service';

describe('RepoUserService', () => {
  let service: RepoUserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RepoUserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('When the login method is called', () => {
    it('Then it should return the token', () => {
      const spyLocal = spyOn(localStorage, 'setItem').and.callThrough();
      const spyNext = spyOn(service.token$, 'next').and.callThrough();

      service.loginUser(mockLogin).subscribe((data) => {
        expect(data).not.toBeNull();
        expect(data).toBe(mockToken);
        expect(spyLocal).toHaveBeenCalled();
        expect(spyNext).toHaveBeenCalled();
      });
      const req = httpTestingController.expectOne(TestApiUserUrl + '/login');
      expect(req.request.method).toEqual('POST');
      req.flush(mockResp);
    });
  });

  describe('When initialToken method is called', () => {
    describe('And there is a token in localStorage', () => {
      it('Then it should call this.token$.next with retrieved value', () => {
        const nextSpy = spyOn(service.token$, 'next').and.callThrough();
        const localSpy = spyOn(localStorage, 'getItem').and.returnValue(
          'TestToken'
        );

        service.initialToken();
        expect(localSpy).toHaveBeenCalled();
        expect(nextSpy).toHaveBeenCalledWith('TestToken');
      });
    });

    describe('And there is no token in LocalStorage', () => {
      it('Then it should call this.token$.next with empty string', () => {
        const spyNext = spyOn(service.token$, 'next').and.callThrough();
        const localSpy = spyOn(localStorage, 'getItem').and.returnValue('');

        service.initialToken();
        expect(localSpy).toHaveBeenCalled();
        expect(spyNext).toHaveBeenCalledWith('');
      });
    });
  });

  describe('When the getCurrentUser method is called', () => {
    describe('if we have token$', () => {
      it('it should not return the user from API', async () => {
        service.token$.next('');

        const header4 = new HttpHeaders({
          ['Authorization']: `Bearer ${service.token$.value}`,
        });
        service.getCurrentUser('12345').subscribe((resp) => {
          expect(resp).not.toBeNull();
          expect(JSON.stringify(resp)).toBe(JSON.stringify(mockUser));
        });
        expect(httpTestingController).toBeTruthy();
        const req = httpTestingController.expectOne(TestApiUserUrl + '/12345');
        req.flush(mockResp1);

        expect(req.request.method).toEqual('GET');
        expect(JSON.stringify(req.request.headers)).toBe(
          JSON.stringify(header4)
        );
      });
    });

    describe('And there is a token$', () => {
      it('should return the user from API', async () => {
        service.token$.next('TestToken');

        const header1 = new HttpHeaders({
          ['Authorization']: `Bearer ${service.token$.value}`,
        });
        service.getCurrentUser('6789').subscribe((resp) => {
          expect(resp).not.toBeNull();
          expect(JSON.stringify(resp)).toBe(JSON.stringify(mockUser3));
        });
        expect(httpTestingController).toBeTruthy();
        const req = httpTestingController.expectOne(TestApiUserUrl + '/6789');
        req.flush(mockResp2);

        expect(req.request.method).toEqual('GET');
        expect(JSON.stringify(req.request.headers)).toBe(
          JSON.stringify(header1)
        );
      });
    });
  });

  describe('When registerUser method is called', () => {
    it('it should send a post request with the user data', async () => {
      service.registerUser(mockUser).subscribe((resp) => {
        expect(resp).not.toBeNull();
      });
      expect(httpTestingController).toBeTruthy();
      const req = httpTestingController.expectOne(TestApiUserUrl + '/register');
      req.flush(mockUser);

      expect(req.request.method).toEqual('POST');
    });
  });
  describe('Given the update and delete method', () => {
    describe('When the updateUser method is called', () => {
      describe('And there is no token$', () => {
        it('should not return the user from API', async () => {
          service.token$.next('TestToken');
          const header2 = new HttpHeaders({
            ['Authorization']: `Bearer ${service.token$.value}`,
          });

          service.updateUser('123', mockUser1).subscribe((resp) => {
            expect(resp).not.toBeNull();
            expect(JSON.stringify(resp)).toBe(JSON.stringify(mockUser1));
          });
          expect(httpTestingController).toBeTruthy();
          const req = httpTestingController.expectOne(TestApiUserUrl + '/123');
          req.flush(mockUser1);

          expect(req.request.method).toEqual('PUT');
          expect(JSON.stringify(req.request.headers)).toBe(
            JSON.stringify(header2)
          );
        });
      });
    });
    describe('When the deleteUser method is called', () => {
      describe('And there is token$', () => {
        it('should return the user from API', async () => {
          service.token$.next('TestToken');

          const header3 = new HttpHeaders({
            ['Authorization']: `Bearer ${service.token$.value}`,
          });
          service.deleteUser('123').subscribe((resp) => {
            expect(resp).not.toBeNull();
            expect(JSON.stringify(resp)).toBe(JSON.stringify(mockUser1));
          });
          expect(httpTestingController).toBeTruthy();
          const req = httpTestingController.expectOne(TestApiUserUrl + '/123');
          req.flush(mockUser1);

          expect(req.request.method).toEqual('DELETE');
          expect(JSON.stringify(req.request.headers)).toBe(
            JSON.stringify(header3)
          );
        });
      });
    });
  });
});

import { HttpHeaders } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ServerLoginResponse,
  ServerCompleteUserResponse,
} from 'src/app/types/server.response';
import { Login } from 'src/app/types/types';
import { mockToken, mockUser, mockUser1 } from 'src/app/utils/mocks';
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
      const mockResp: ServerLoginResponse = {
        results: { token: mockToken },
      };
      const mockLogin: Login = {
        email: 'TestMail',
        password: 'test',
      };

      const spyLocal = spyOn(localStorage, 'setItem').and.callThrough();
      const spyNext = spyOn(service.token$, 'next').and.callThrough();

      service.loginUser(mockLogin).subscribe((data) => {
        expect(data).not.toBeNull();
        expect(data).toBe(mockToken);
        expect(spyLocal).toHaveBeenCalled();
        expect(spyNext).toHaveBeenCalled();
      });
      const req = httpTestingController.expectOne(
        'http://localhost:4800/users/login'
      );
      expect(req.request.method).toEqual('POST');
      req.flush(mockResp);
    });
  });

  describe('When initialToken method is called', () => {
    describe('And there is a token in localStorage', () => {
      it('Then it should call this.token$.next with retrieved value', () => {
        const spyNext = spyOn(service.token$, 'next').and.callThrough();
        const spyLocal = spyOn(localStorage, 'getItem').and.returnValue(
          'TestToken'
        );

        service.initialToken();
        expect(spyLocal).toHaveBeenCalled();
        expect(spyNext).toHaveBeenCalledWith('TestToken');
      });
    });

    describe('And there is no token in LocalStorage', () => {
      it('Then it should call this.token$.next with empty string', () => {
        const spyNext = spyOn(service.token$, 'next').and.callThrough();
        const spyLocal = spyOn(localStorage, 'getItem').and.returnValue('');

        service.initialToken();
        expect(spyLocal).toHaveBeenCalled();
        expect(spyNext).toHaveBeenCalledWith('');
      });
    });
  });

  describe('When the getCurrentUser method is called', () => {
    describe('And there is no token$', () => {
      it('should not return the user from API', async () => {
        service.token$.next('');
        const mockResp: ServerCompleteUserResponse = {
          results: [mockUser],
        };
        const header = new HttpHeaders({
          ['Authorization']: `Bearer ${service.token$.value}`,
        });
        service.getCurrentUser('12345').subscribe((resp) => {
          expect(resp).not.toBeNull();
          expect(JSON.stringify(resp)).toBe(JSON.stringify(mockUser));
        });
        expect(httpTestingController).toBeTruthy();
        const req = httpTestingController.expectOne(
          'http://localhost:4800/users/12345'
        );
        req.flush(mockResp);

        expect(req.request.method).toEqual('GET');
        expect(JSON.stringify(req.request.headers)).toBe(
          JSON.stringify(header)
        );
      });
    });

    describe('And there is a token$', () => {
      it('should return the user from API', async () => {
        service.token$.next('TestToken');
        const mockResp: ServerCompleteUserResponse = {
          results: [mockUser],
        };
        const header = new HttpHeaders({
          ['Authorization']: `Bearer ${service.token$.value}`,
        });
        service.getCurrentUser('12345').subscribe((resp) => {
          expect(resp).not.toBeNull();
          expect(JSON.stringify(resp)).toBe(JSON.stringify(mockUser));
        });
        expect(httpTestingController).toBeTruthy();
        const req = httpTestingController.expectOne(
          'http://localhost:4800/users/12345'
        );
        req.flush(mockResp);

        expect(req.request.method).toEqual('GET');
        expect(JSON.stringify(req.request.headers)).toBe(
          JSON.stringify(header)
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
      const req = httpTestingController.expectOne(
        'http://localhost:4800/users/register'
      );
      req.flush(mockUser);

      expect(req.request.method).toEqual('POST');
    });
  });

  describe('When the updateUser method is called', () => {
    describe('And there is no token$', () => {
      it('should not return the user from API', async () => {
        service.token$.next('TestToken');
        const mockResp = {
          results: mockUser1,
        };
        const header = new HttpHeaders({
          ['Authorization']: `Bearer ${service.token$.value}`,
        });
        service.updateUser('123', mockUser1).subscribe((resp) => {
          expect(resp).not.toBeNull();
          expect(JSON.stringify(resp)).toBe(JSON.stringify(mockUser1));
        });
        expect(httpTestingController).toBeTruthy();
        const req = httpTestingController.expectOne(
          'http://localhost:4800/users/123'
        );
        req.flush(mockUser1);

        expect(req.request.method).toEqual('PUT');
        expect(JSON.stringify(req.request.headers)).toBe(
          JSON.stringify(header)
        );
      });
    });
  });
  describe('When the deleteUser method is called', () => {
    describe('And there is token$', () => {
      it('should return the user from API', async () => {
        service.token$.next('TestToken');
        const mockResp = {
          results: mockUser1,
        };
        const header = new HttpHeaders({
          ['Authorization']: `Bearer ${service.token$.value}`,
        });
        service.deleteUser('123').subscribe((resp) => {
          expect(resp).not.toBeNull();
          expect(JSON.stringify(resp)).toBe(JSON.stringify(mockUser1));
        });
        expect(httpTestingController).toBeTruthy();
        const req = httpTestingController.expectOne(
          'http://localhost:4800/users/123'
        );
        req.flush(mockUser1);

        expect(req.request.method).toEqual('DELETE');
        expect(JSON.stringify(req.request.headers)).toBe(
          JSON.stringify(header)
        );
      });
    });
  });
});

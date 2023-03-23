import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { repoService, User } from './user.service';

describe('repoService', () => {
  let service: repoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [repoService],
    });
    service = TestBed.inject(repoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerUser', () => {
    it('should register a new user', () => {
      const user: User = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password',
        img: 'test.jpg',
      };

      service.registerUser(user).subscribe((result) => {
        expect(result).toBeDefined();
      });

      const req = httpMock.expectOne('http://localhost:4800/users/register');
      expect(req.request.method).toEqual('POST');
      req.flush({ result: true });
    });
  });

  describe('loginUser', () => {
    it('should login a user', () => {
      const user: Partial<User> = {
        email: 'test@test.com',
        password: 'password',
      };

      service.loginUser(user).subscribe((result) => {
        expect(result).toBeDefined();
      });

      const req = httpMock.expectOne('http://localhost:4800/users/login');
      expect(req.request.method).toEqual('POST');
      req.flush({ result: true });
    });
  });

  describe('loadUser', () => {
    it('should load user data', () => {
      const headers = { Authorization: 'Bearer token' };

      service.loadUser(headers).subscribe((users) => {
        expect(users.length).toBeGreaterThan(0);
      });

      const req = httpMock.expectOne('http://localhost:4800/users/');
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer token');
      req.flush([
        {
          name: 'Test User',
          email: 'test@test.com',
          password: 'password',
          img: 'test.jpg',
        },
      ]);
    });
  });
});

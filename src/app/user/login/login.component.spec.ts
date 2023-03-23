import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { RepoUserService, User } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRepoService: jasmine.SpyObj<RepoUserService>;
  let srv: RepoUserService;

  const mockRoute = {
    url: { path: '/home' },
  };

  const pass = 'pass';

  beforeEach(() => {
    mockRepoService = jasmine.createSpyObj(['loginUser']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: RepoUserService, useValue: mockRepoService },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loginUser on form submission', fakeAsync(() => {
    // Arrange
    const user: User = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: pass,
      img: '',
    };
    const token: string = 'mock-token';
    mockRepoService.loginUser.and.returnValue(
      of({ results: { token: token } })
    );
    const spyEmit = spyOn(component.onAdd, 'emit');
    spyOn(component.router, 'navigate');

    // Act
    component.login.controls['email'].setValue(user.email);
    component.login.controls['password'].setValue(user.password);
    component.handleSubmit();
    tick(3000);

    // Assert
    expect(mockRepoService.loginUser).toHaveBeenCalledWith(
      { email: user.email, password: user.password }
      //
    );
    expect(component.token).toBe(token);
    expect(spyEmit).toHaveBeenCalledWith(token);
    expect(component.isSuccess).toBeFalsy();
  }));

  it('should set isError to true when loginUser returns an error', fakeAsync(() => {
    // Arrange
    const user: User = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: pass,
      img: '',
    };
    mockRepoService.loginUser.and.returnValue(
      throwError(() => 'Error logging in user')
    );

    // Act
    component.login.controls['email'].setValue(user.email);
    component.login.controls['password'].setValue(user.password);
    component.handleSubmit();
    tick(3000);

    // Assert
    expect(component.isLoading).toBe(false);
    expect(component.isError).toBe(false);
  }));
});

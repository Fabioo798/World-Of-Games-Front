import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { repoService, User } from 'src/app/services/user/user.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRepoService: jasmine.SpyObj<repoService>;

  beforeEach(async(() => {
    mockRepoService = jasmine.createSpyObj(['loginUser']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: repoService, useValue: mockRepoService }],
    }).compileComponents();
  }));

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
      password: 'password',
      img: '',
    };
    const token = 'mock-token';
    mockRepoService.loginUser.and.returnValue(of({ results: token }));
    spyOn(component.onAdd, 'emit');

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
    expect(component.onAdd.emit).toHaveBeenCalledWith({ email: user.email });
    expect(component.isSuccess).toBeTruthy();
    expect(component.login.value).toEqual({ email: '', password: '' });
  }));

  it('should set isError to true when loginUser returns an error', fakeAsync(() => {
    // Arrange
    const user: User = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      img: '',
    };
    mockRepoService.loginUser.and.returnValue(
      throwError('Error logging in user')
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

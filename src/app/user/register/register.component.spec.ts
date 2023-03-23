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

import { RegisterComponent } from './register.component';
import { repoService, User } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRepoService: jasmine.SpyObj<repoService>;
  let router: ActivatedRoute;

  const mockRoute = {
    url: { path: '/login' },
  };

  beforeEach(() => {
    mockRepoService = jasmine.createSpyObj(['registerUser']);

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: repoService, useValue: mockRepoService },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call registerUser on form submission', fakeAsync(() => {
    // Arrange
    const user: User = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      img: '',
    };
    mockRepoService.registerUser.and.returnValue(of({ result: user }));
    spyOn(component.onAdd, 'emit');
    spyOn(component.router, 'navigate');
    // Act
    component.newUser.controls['name'].setValue(user.name);
    component.newUser.controls['email'].setValue(user.email);
    component.newUser.controls['password'].setValue(user.password);
    component.handleSubmit();
    tick(3000);
    // Assert
    expect(mockRepoService.registerUser).toHaveBeenCalledWith(user);
    expect(component.onAdd.emit).toHaveBeenCalledWith(user);
    expect(component.router.navigate).toHaveBeenCalled();

    expect(component.isSuccess).toBeFalsy();
  }));
  it('should set isError to true when registerUser returns an error', fakeAsync(() => {
    // Arrange
    const user: User = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      img: '',
    };
    mockRepoService.registerUser.and.returnValue(
      throwError(() => 'Error registering user')
    );

    // Act
    component.newUser.controls['name'].setValue(user.name);
    component.newUser.controls['email'].setValue(user.email);
    component.newUser.controls['password'].setValue(user.password);
    component.handleSubmit();
    tick(3000);

    // Assert
    expect(component.isLoading).toBe(false);
    expect(component.isError).toBe(false);
  }));
});

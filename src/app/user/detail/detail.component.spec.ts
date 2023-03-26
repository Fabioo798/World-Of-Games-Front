import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { User } from 'src/app/types/types';
import { RepoUserService } from 'src/app/services/user/user.service';

import { UserDetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let mockUserService: jasmine.SpyObj<RepoUserService>;

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj('RepoUserService', [
      'getCurrentUser',
    ]);

    TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      providers: [{ provide: RepoUserService, useValue: mockUserService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current user', () => {
    const user: User = { id: 1, name: 'John Doe' } as unknown as User;
    mockUserService.getCurrentUser.and.returnValue(of(user));

    // component.ngOnInit();

    expect(component.currentUser$).toBeDefined();
    expect(component.currentUser$).toEqual(of(user));
  });
});

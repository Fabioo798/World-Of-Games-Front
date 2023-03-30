import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { FooterComponent } from './footer.component';
import { Subject } from 'rxjs';
import { RepoUserService } from 'src/app/services/user/user.service';
import { mockUserService } from 'src/app/utils/mocks';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let router: Router;
  let routerEventsSubject: Subject<any>;
  let srv: RepoUserService;

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();

    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEventsSubject.asObservable(),
          },
        },
        { provide: RepoUserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set currentPage when navigation ends', () => {
    const event = new NavigationEnd(0, '/', '/');
    routerEventsSubject.next(event);
    fixture.detectChanges();
    expect(component.currentPage).toEqual('/');

    const event1 = new NavigationEnd(0, '/', '/');
    routerEventsSubject.next(event1);
    fixture.detectChanges();
    expect(component.currentPage).toEqual('/');

    const aboutEvent = new NavigationEnd(1, '/about', '/about');
    routerEventsSubject.next(aboutEvent);
    fixture.detectChanges();
    expect(component.currentPage).toEqual('/about');
  });
});

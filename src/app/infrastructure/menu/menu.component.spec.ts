import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [RouterTestingModule, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isButtonClicked to true when button is clicked', () => {
    const button = fixture.debugElement.query(By.css('a'));
    button.triggerEventHandler('click', null);
    expect(component.isButtonClicked).toBeTrue();
  });

  it('should set isButtonClicked to false after 900ms', fakeAsync(() => {
    const button = fixture.debugElement.query(By.css('a'));
    button.triggerEventHandler('click', null);
    expect(component.isButtonClicked).toBeTrue();

    tick(900);
    fixture.detectChanges();
    expect(component.isButtonClicked).toBeFalse();
  }));
});

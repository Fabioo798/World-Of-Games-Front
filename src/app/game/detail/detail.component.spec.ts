import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { DetailComponent } from './detail.component';
import { BehaviorSubject, of } from 'rxjs';
import { RepoGameService } from 'src/app/services/game/game.services.service';
import { Game } from 'src/app/types/types';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  const mockGameService = {
    queryTeams: () => {},
    games$: new BehaviorSubject([{ id: '' }]),
  };

  const mockRoute = {
    params: of({ id: '456' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockRoute,
        },
        {
          provide: RepoGameService,
          useValue: mockGameService,
        },
      ],
      declarations: [DetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should bring the new teams calling ngOnInit', () => {
    component.ngOnInit();
    mockGameService.games$ = new BehaviorSubject([
      { id: '123' },
      { id: '456' },
    ]);
    expect(mockGameService.games$).toBeTruthy();
  });

  it('should set game to found game if game is found', () => {
    component.games = [{ id: '123' }, { id: '456' }] as Game[];
    component.params['id'] = '123';
    component.findGame();
    expect(component.game.id).toEqual('123');
  });

  it('should not set game if game is not found', () => {
    component.games = [{ id: '123' }, { id: '456' }] as unknown as Game[];
    component.params['id'] = '789';
    component.findGame();
    expect(component.game).toEqual({} as Game);
  });
});

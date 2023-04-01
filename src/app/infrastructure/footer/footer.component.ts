import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RepoUserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentPage: string = '/';
  isLogged: string | undefined = '';
  constructor(private router: Router, public srv: RepoUserService) {
    this.srv.userLogged$.subscribe((user) => {
      this.isLogged = user?.id;
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.currentPage = event.url;
      });
  }
}

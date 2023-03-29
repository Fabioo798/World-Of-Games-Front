import { Component } from '@angular/core';
import { MenuItems } from 'src/app/types/types';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  btns: MenuItems[];
  constructor() {
    this.btns = [
      { path: 'games', label: 'Home', icon: 'home-solid' },
      { path: 'cart', label: 'cart', icon: 'shopping_cart' },
      { path: 'create', label: 'Add', icon: 'add_circle_outline' },
      { path: 'user/:id', label: 'account', icon: 'person' },
    ];
  }
}

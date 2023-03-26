import { BehaviorSubject, Observable, Subject } from "rxjs";
import { LoggedUser, User } from "../types/types";


export const mockPass = 'pass'


export const mockUser: User = {
  id: '12345',
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: mockPass,
  img: '',
};

export const mockRoute = {
  url: { path: '/login' },
};

export const mockToken =
  'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJpZCI6IiIsImVtYWlsIjoiIiwicm9sZSI6IiIsImlhdCI6MTY3OTA0ODgwNH0.U8s8UMTJddjfXH_qbxiJJ5GuJeEhryxFmv8d8DBMsycVTt-k1sdAFEq9yRUXbawo';

export const mockUserService = {
  loginUser: () => {
    return new BehaviorSubject<string>('TestToken');
  },
  initialToken: () => {
    return;
  },
  userRegister: () => {
    return;
  },
  getCurrentUser: () => {
    return new Observable<User>();
  },
  userLogged$: new Subject<LoggedUser>(),
  token$: new BehaviorSubject<string>('TestToken'),
  currentUser$: new BehaviorSubject<User>(mockUser),
};

export const mockGameService = {
  createGame: () => {
    return;
  }
}

export type User = {
  id?: string;
  name: string;
  email: string;
  password: string;
  img: string;
  shopList?: Game[];
  myGames?: Game[];
  address?: string;
};

export type gameCategory = 'MOBA' | 'RPG' | 'MMO' | 'FPS' | 'Action';

export type Game = {
  id?: string;
  gameName: string;
  category: gameCategory;
  releaseDate: string;
  img: string;
  price: number;
  owner?: Partial<User>;
  description: string;
};

export type Token = {
  results: {
    token: string;
  };
};

export interface MenuItems {
  label: string;
  path: string;
  icon: string;
}

export interface LoggedUser {
  id: string;
  email: string;
  role: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  img: string;
}

export interface Login {
  email: string;
  password: string;
}

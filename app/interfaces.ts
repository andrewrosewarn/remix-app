export interface Movie {
  id: string;
  title: string;
  genre: string;
}

export interface MovieDetail extends Movie {
  description: string;
}

export interface Review {
  id: string;
  comment: string;
}

export interface Genre {
  id: string;
  title: string;
}

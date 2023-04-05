import { json } from "@remix-run/node";
import { Genre, Movie, MovieDetail, Review } from "~/interfaces";
import { getMovies } from "./movies.server";
const fs = require("fs/promises");

const delay = (timeout: number) =>
  new Promise((res) => {
    setTimeout(() => res("done"), timeout);
  });

export async function getMovie(): Promise<MovieDetail> {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        id: "aliens",
        title: "Aliens",
        genre: "Sci-Fi",
        description:
          "57 years after Ellen Ripley had a close encounter with the reptilian alien creature from the first movie, she is called back, this time, to help a group of highly trained colonial marines fight off against the sinister extraterrestrials. But this time, the aliens have taken over a space colony on the moon LV-426. When the colonial marines are called upon to search the deserted space colony, they later find out that they are up against more than what they bargained for. Using specially modified machine guns and enough firepower, it's either fight or die as the space marines battle against the aliens. As the Marines do their best to defend themselves, Ripley must attempt to protect a young girl who is the sole survivor of the nearly wiped out space colony",
      });
    }, 0);
  });
}

export async function getReviews(): Promise<Review[]> {
  return new Promise((res) => {
    setTimeout(() => {
      res([
        {
          id: "alien-one",
          comment: "Great films really enjoyed this",
        },
        {
          id: "alien-two",
          comment: "Wow a sequel better than the original, amazing",
        },
        {
          id: "alien-three",
          comment: "Can't wait for the third",
        },
      ]);
    }, 3000);
  });
}

export async function createMovie(movie: Movie) {
  const currentMovies = await getMovies();

  const newMovieData = [...currentMovies, movie];

  await delay(1000);
  return fs.writeFile("./datasources/movies.json", JSON.stringify(newMovieData));
}

export async function deleteMovie(movieId: string) {
  const currentMovies = await getMovies();

  const deletedMovieData = currentMovies.filter((movie) => movie.id !== movieId);

  await delay(1000);
  return fs.writeFile("./datasources/movies.json", JSON.stringify(deletedMovieData));
}

export async function getGenres() {
  const rawData = await fs.readFile("./datasources/genres.json");
  const genres = JSON.parse(rawData) as Genre[];

  return genres;
}

export async function getEtags() {
  const rawData = await fs.readFile("./datasources/etags.json");
  const tags = JSON.parse(rawData);

  return tags;
}

export async function setEtags(newTag: string) {
  return fs.writeFile("./datasources/etags.json", JSON.stringify({ tag: newTag }));
}

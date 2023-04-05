import { Movie } from "~/interfaces";
const fs = require("fs/promises");

export async function getMovies(genre?: string, criteria?: string) {
  const rawData = await fs.readFile("./datasources/movies.json");
  const movies = JSON.parse(rawData) as Movie[];

  if (genre) {
    return movies.filter((movie) => movie.genre === genre);
  }

  if (criteria) {
    return movies.filter(
      (movie) => movie.title.substring(0, criteria.length).toLowerCase() === criteria.toLocaleLowerCase()
    );
  }

  return movies;
}

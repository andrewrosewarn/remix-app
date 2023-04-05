import { LoaderArgs } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useRouteLoaderData,
  NavLink,
  Outlet,
  useSubmit,
  useLocation,
} from "@remix-run/react";
import { Genre } from "~/interfaces";
import { getMovies } from "~/services/movies.server";

export async function loader({ params, request }: LoaderArgs) {
  const queryString = new URL(request.url).searchParams;
  const filters = queryString.getAll("genre");

  let movies = await getMovies();
  if (filters.length > 0) {
    movies = movies.filter((movie) => filters.includes(movie.genre));
  }

  return { movies, filters };
}

export default function Movies() {
  const submit = useSubmit();
  const { movies, filters } = useLoaderData<typeof loader>();
  const { genres } = useRouteLoaderData("routes/_app") as { genres: Genre[] };

  return (
    <>
      <h2 className="text-xl">Movies</h2>
      <p>This is the root of the movies section</p>

      <section className="flex gap-6 mt-4">
        <Form method="get" className="p-4 bg-slate-100" onChange={(e) => submit(e?.currentTarget, { replace: true })}>
          {genres.map((genre) => (
            <label className="block cursor-pointer" key={genre.id}>
              <input type="checkbox" name="genre" value={genre.id} defaultChecked={filters.includes(genre.id)} />
              <span className="ml-2">{genre.title}</span>
            </label>
          ))}
          <button className="mt-4">Apply</button>
        </Form>

        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function ErrorBoundary({ error }: any) {
  return (
    <div>
      <h2>Error</h2>
      <p>Oops and error had occurred.</p>
    </div>
  );
}

import { LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useRouteLoaderData, NavLink, Outlet } from "@remix-run/react";
import { Genre } from "~/interfaces";
import { getMovies } from "~/services/movies.server";

export async function loader({ params, request }: LoaderArgs) {
  const queryString = new URL(request.url).searchParams;
  let criteria;

  if (queryString.get("criteria")) {
    criteria = queryString.get("criteria");
  }

  const movies = await getMovies(params.id, criteria ?? undefined);

  return { movies, criteria };
}

export default function Movies() {
  const { movies, criteria } = useLoaderData<typeof loader>();
  const { genres } = useRouteLoaderData("routes/_app") as { genres: Genre[] };

  return (
    <>
      <h2 className="text-xl">Movies</h2>
      <p>This is the root of the movies section</p>
      <div className="flex gap-4 my-4">
        <NavLink to="/movies" end className={({ isActive }) => (isActive ? "underline" : undefined)}>
          All
        </NavLink>
        {genres.map((genre) => (
          <NavLink
            to={`/movies/${genre.id}`}
            key={genre.id}
            className={({ isActive }) => (isActive ? "underline" : undefined)}
          >
            {genre.title}
          </NavLink>
        ))}
      </div>

      <Form method="get">
        <input name="criteria" defaultValue={criteria ?? ""} className="bg-slate-100 p-2" autoComplete="off" />
        <button type="submit">Search</button>
      </Form>

      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
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

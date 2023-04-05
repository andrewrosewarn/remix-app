import { ActionArgs, HeadersFunction, json, LoaderArgs } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Form, useActionData, useFetcher, useLoaderData, useNavigation, useRouteLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Genre, Movie } from "~/interfaces";
import { createMovie, deleteMovie, getEtags, setEtags } from "~/services/movie.server";
import { getMovies } from "~/services/movies.server";

export const shouldRevalidate: ShouldRevalidateFunction = ({ actionResult, defaultShouldRevalidate }) => {
  if ((actionResult as any).ok) {
    return defaultShouldRevalidate;
  }
  return false;
};

export async function loader({}: LoaderArgs) {
  const movies = await getMovies();
  return movies;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "create") {
    const title: string = formData.get("title")! as string;
    const genre: string = formData.get("genre")! as string;

    let errors = {
      title: "",
      genre: "",
    };

    if (title === "") {
      errors.title = "Title is required";
    }
    if (genre === "") {
      errors.genre = "Genre is required";
    }

    if (Object.values(errors).some((er) => er !== "")) {
      return json({ ok: false, ...errors }, 400);
    }

    const newMovie: Movie = {
      id: title.replace(/\s+/g, "-").toLowerCase(),
      title,
      genre,
    };

    try {
      await createMovie(newMovie);
      return { ok: true };
    } catch (e) {
      return { ok: false };
    }
  }

  if (action === "delete") {
    const movieId = formData.get("id")! as string;
    await deleteMovie(movieId);
  }

  return { ok: true };
}

export default function Admin() {
  const { genres } = useRouteLoaderData("routes/_app") as { genres: Genre[] };
  const navigation = useNavigation();
  const movies = useLoaderData<typeof loader>();
  const errors = useActionData();

  const isAdding = navigation.state === "submitting" && navigation.formData?.get("_action") === "create";
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!isAdding && !errors) {
      formRef.current?.reset();
    }
  }, [isAdding, errors]);

  return (
    <>
      <h2 className="text-xl">Admin</h2>
      <ul className="my-4">
        {movies.map((movie) => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </ul>

      <div>
        <Form method="post" ref={formRef}>
          <div>
            <label htmlFor="title">Title</label>
            <input className="bg-slate-100 block p-2 rounded" id="title" name="title" autoComplete="off" />
            {errors && errors.title !== "" ? <div className="text-red-800 ">{errors.title}</div> : null}
          </div>
          <div>
            <label htmlFor="genre">Genre</label>
            <select className="bg-slate-100 block p-2 rounded cursor-pointer" name="genre" id="genre">
              <option value=""></option>
              {genres.map((genre) => (
                <option value={genre.id} key={genre.id}>
                  {genre.title}
                </option>
              ))}
            </select>
            {errors && errors.genre !== "" ? <div className="text-red-800">{errors.genre}</div> : null}
          </div>
          <button className="bg-slate-100 block py-2 px-6 mt-4 rounded" type="submit" name="_action" value="create">
            {isAdding ? "Saving..." : "Save"}
          </button>
        </Form>
      </div>
    </>
  );
}

function MovieItem({ movie }: { movie: Movie }) {
  const fetcher = useFetcher();

  const isDeleting = fetcher.formData?.get("id") === movie.id;

  return (
    <li className="flex gap-2">
      <span>{movie.title}</span>
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={movie.id} />
        <button className="bg-slate-100 px-2" name="_action" value="delete">
          {isDeleting ? "..." : "x"}
        </button>
      </fetcher.Form>
    </li>
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

import { json, LoaderArgs } from "@remix-run/node";
import { NavLink, Outlet, useLocation } from "@remix-run/react";
import AppLink from "~/components/AppLink";
import { getEtags, getGenres } from "~/services/movie.server";

export async function loader({ request }: LoaderArgs) {
  const genres = await getGenres();
  return json({ genres });
}

export default function App() {
  return (
    <>
      <header className="p-4 bg-slate-100">
        <h1 className="text-2xl">Movies</h1>
        <nav className="flex gap-4 mt-2">
          <AppLink to="/" className={({ isActive }) => (isActive ? "underline" : undefined)}>
            Home
          </AppLink>
          <AppLink className={({ isActive }) => (isActive ? "underline" : undefined)} to="/movies">
            Movies
          </AppLink>
          <AppLink className={({ isActive }) => (isActive ? "underline" : undefined)} to="/admin">
            Admin
          </AppLink>
        </nav>
      </header>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}

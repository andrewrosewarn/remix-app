import { defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import Reviews from "~/components/Reviews";
import { getMovie, getReviews } from "~/services/movie.server";

export async function loader() {
  const [movieData, reviewsData] = [getMovie(), getReviews()];

  return defer({
    movie: await movieData,
    reviews: reviewsData,
  });
}

export default function Movie() {
  const { movie, reviews } = useLoaderData<typeof loader>();

  return (
    <>
      <h2 className="text-xl mb-2">{movie.title}</h2>
      <p>{movie.description}</p>
      <h2 className="text-xl mb-2 mt-4">Reviews</h2>
      <Suspense fallback={<div className="mt-4">Loading reviews...</div>}>
        <Await resolve={reviews}>
          <Reviews />
        </Await>
      </Suspense>
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

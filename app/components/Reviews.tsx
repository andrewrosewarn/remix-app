import { useAsyncValue } from "@remix-run/react";
import { Review } from "~/interfaces";

export default function Reviews() {
  const reviews = useAsyncValue() as Review[];

  return (
    <ul>
      {reviews.map((review: any) => (
        <li className="bg-slate-100 my-2 py-2 px-4" key={review.id}>
          {review.comment}
        </li>
      ))}
    </ul>
  );
}

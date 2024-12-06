import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft as Left, ChevronRight as Right } from "lucide-react";
import { Button } from "../";
import { useMovies } from "../../hooks";

// Constante para la imagen por defecto
const DEFAULT_POSTER = "https://placehold.co/400x600?text=No+Poster"; // Puedes cambiar esta URL por la que prefieras

export function MovieList({
  title = "",
  query = {},
  className = "",
  itemClassName = "",
  titleClassName = "",
  paginationVariant = "primary",
}) {
  const [page, setPage] = useState(0);
  const {
    _embedded: { movieList = [] } = { movieList: [] },
    page: { totalPages = 1, number = 0 } = {},
  } = useMovies({ ...query, pagination: { ...query.pagination, page } });

  console.log("MovieList movies:", movieList);

  const hasNext = number < totalPages - 1;
  const hasPrevious = number > 0;

  const nextPage = (evt) => {
    evt?.target?.blur();
    setPage((page) => page + 1);
  };
  const prevPage = (evt) => {
    evt?.target?.blur();
    setPage((page) => page - 1);
  };

  return (
    <section className={`p-4 w-full mx-auto ${className}`}>
      {title !== "" ? (
        <h1 className={`mb-8 text-3xl font-extrabold ${titleClassName}`}>
          {title}
        </h1>
      ) : null}

      <div className="w-full flex items-center gap-4">
        <Button
          className="rounded-full"
          variant={paginationVariant}
          disabled={!hasPrevious}
          onClick={prevPage}
        >
          <Left className="w-6 h-6 pointer-events-none" />
        </Button>
        <ul className="w-full flex-1 grid grid-cols-7 gap-2 relative items-center justify-center">
          {movieList.map((movie) => (
            <Poster movie={movie} key={movie.id} className={itemClassName} />
          ))}
        </ul>
        <Button
          className="rounded-full"
          variant={paginationVariant}
          disabled={!hasNext}
          onClick={nextPage}
        >
          <Right className="w-6 h-6 pointer-events-none" />
        </Button>
      </div>
    </section>
  );
}

function Poster({ className = "", movie }) {
  const [imageError, setImageError] = useState(false);
  const posterResource = movie.resources?.find((res) => res.type === "POSTER");
  const posterUrl =
    !imageError && posterResource?.url ? posterResource.url : DEFAULT_POSTER;

  return (
    <li
      className={`w-full transition transform cursor-pointer rounded-md bg-white overflow-hidden relative shadow
                             hover:scale-125 hover:shadow-md hover:z-20
                             ${className}`}
      style={{ aspectRatio: "2/3" }}
    >
      <Link to={`/movies/${movie.id}`}>
        <img
          className="w-full h-full object-cover"
          src={posterUrl}
          alt={movie.title}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </Link>
    </li>
  );
}

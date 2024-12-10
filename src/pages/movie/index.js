import { useParams } from "react-router-dom";
import { CircleChevronLeft as Back, Pencil as Edit } from "lucide-react";
import ReactPlayer from "react-player";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";

import Rating from "../../components/Rating";
import { Shell, Link, Separator } from "../../components";

import { useMovie, useComments } from "../../hooks";

import Disney from "./icons/disney_plus.png";
import Play from "./icons/google_play.png";
import HBO from "./icons/hbo.png";
import ITunes from "./icons/itunes.png";
import Netflix from "./icons/netflix.png";
import Prime from "./icons/prime_video.png";
import Youtube from "./icons/youtube.png";

const backdrop = (movie) => {
  const backdrop = movie?.resources?.find(
    (res) => res?.type === "BACKDROP"
  )?.url;
  const poster = movie?.resources?.find((res) => res?.type === "POSTER")?.url;

  return backdrop ? backdrop : poster;
};
const poster = (movie) =>
  movie?.resources?.find((res) => res?.type === "POSTER")?.url;

export default function Movie() {
  const { id } = useParams();
  const { movie, update } = useMovie(id);

  return (
    <Shell>
      <img
        style={{ height: "36rem" }}
        src={backdrop(movie)}
        alt={`${movie.title} backdrop`}
        className="object-cover absolute right-0 left-0 top-2 w-full filter blur transform scale-105"
      />

      <Link
        variant="primary"
        className="flex absolute top-4 left-8 gap-4 items-center py-2 pr-4 pl-2 text-white rounded-full"
        to="/"
      >
        <Back className="w-8 h-8" />
        <span>Volver</span>
      </Link>

      <Link
        variant="primary"
        className="flex absolute top-4 right-8 gap-4 items-center px-2 py-2 text-white rounded-full"
        to={`/movies/${id}/edit`}
      >
        <Edit className="w-8 h-8" />
      </Link>

      <div className="p-8 mx-auto w-full max-w-screen-2xl">
        <Header movie={movie} />
        <Info movie={movie} />
        <View movie={movie} />
        <Cast movie={movie} />
        <Comments movie={movie} />
      </div>
    </Shell>
  );
}

function Header({ movie }) {
  return (
    <header className="flex relative items-end pb-8 mt-64 mb-8">
      <img
        style={{ aspectRatio: "2/3" }}
        src={poster(movie)}
        alt={`${movie.title} poster`}
        className="z-20 w-64 rounded-lg shadow-xl"
      />
      <hgroup className="flex-1">
        <h1
          className={`p-8 text-6xl font-bold text-right text-white bg-black bg-opacity-50 backdrop-filter backdrop-blur`}
        >
          {movie.title}
        </h1>
        <Tagline movie={movie} />
      </hgroup>
    </header>
  );
}
function Info({ movie }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-4">
        <h2 className="p-4 text-2xl font-bold text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 shadow">
          Argumento
        </h2>
        <p className="p-4 pt-8">{movie.overview}</p>
      </div>
      <div className="text-right">
        <dl className="space-y-2">
          <CrewMember movie={movie} job="Director" label="Dirección" />
          <CrewMember movie={movie} job="Producer" label="Producción" />
          <CrewMember movie={movie} job="Screenplay" label="Guión" />
          <CrewMember
            movie={movie}
            job="Original Music Composer"
            label="Banda sonora"
          />
        </dl>
      </div>
    </div>
  );
}
function View({ movie }) {
  return (
    <div className="flex gap-8 mt-8 h-auto">
      <div className="z-10 w-80 h-fit">
        <Links movie={movie} />
      </div>
      <div className="flex-1">
        <div
          style={{
            aspectRatio: "16/9",
          }}
          className="flex z-20 justify-center items-center bg-pattern-2"
        >
          <Trailer movie={movie} />
        </div>
      </div>
    </div>
  );
}

function Cast({ movie }) {
  return (
    <>
      <h2 className="mt-16 text-2xl font-bold">Reparto principal</h2>
      <Separator />
      <ul className="grid overflow-hidden grid-cols-10 gap-2 w-full">
        {movie?.cast?.slice(0, 10).map((person) => (
          <CastMember key={person.name} person={person} />
        ))}
      </ul>
    </>
  );
}
function Comments({ movie }) {
  const { comments = [], createComment } = useComments({
    filter: { movie: movie.id },
  });

  //Definimos el estado para guardar el comentario del user
  const [newComment, setNewComment] = useState("");

  //Definimos el estado para guardar el rating que le asigna el user a la película
  const [newRating, setNewRating] = useState(0);

  //Funcion para manejar el cambio de texto en el formulario
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //Si el comentario que se quiere publicar no está vacío llamamos a la función del hook para crear el comentario
    if (newComment != "") {
      const user = sessionStorage.getItem("user");
      console.log(user);
      createComment({
        movie: {
          id: movie.id,
          title: movie.title,
        },
        comment: newComment,
        rating: newRating, //Incluimos la valoración en el comentario
      });
      setNewComment("");
      setNewRating(0);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-full">
      <h2 className="mt-16 text-2xl font-bold">Comentarios</h2>
      <Separator />
      <div className="space-y-8">
        <div>
          {comments._embedded === undefined ||
          comments._embedded.assessmentList === undefined ||
          comments._embedded.assessmentList.length === 0 ? (
            <p className="italic text-center text-gray-500">
              No hay comentarios por ahora en esta película
            </p>
          ) : comments._embedded.assessmentList.length === 1 ? (
            //Mostrar el comentario si solo hay uno y asi evitar repeticiones innecesarias del propio componente Slider cuando se da este caso
            <div className="px-4 py-2">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 mx-2 h-[200px] flex flex-col justify-between">
                <div>
                  <div className="flex flex-row justify-between">
                    <p className="mb-2">
                      <strong className="text-indigo-600">
                        {comments._embedded.assessmentList[0].user.email}
                      </strong>
                    </p>
                    <Rating
                      rating={comments._embedded.assessmentList[0].rating}
                    />
                  </div>
                  <p className="leading-relaxed text-gray-700 line-clamp-4">
                    {comments._embedded.assessmentList[0].comment}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            //Mostrar el carousel si hay múltiples comentarios de la película
            <div className="relative">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={5000}
                arrows={true}
                className="comments-carousel"
              >
                {comments._embedded.assessmentList.map((comment, index) => (
                  <div key={index} className="px-4 py-2">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 mx-2 h-[200px] flex flex-col justify-between">
                      <div>
                        <div className="flex flex-row justify-between">
                          <p className="mb-2">
                            <strong className="text-indigo-600">
                              {comment.user.email}
                            </strong>
                          </p>
                          <Rating rating={comment.rating} />
                        </div>
                        <p className="leading-relaxed text-gray-700 line-clamp-4">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
          {/* Formulario para crear un comentario */}
          <form className="flex flex-row justify-between items-end mt-12">
            {/* Componente de puntuación y publicar */}
            <div className="flex flex-col gap-5 justify-start">
              <h2>
                <strong>Y a ti, que te ha parecido?</strong>
              </h2>

              <div className="flex flex-col gap-20 justify-start">
                <Rating
                  onRatingChange={setNewRating}
                  rating={newRating}
                  readonly={false}
                />

                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 mt-4 font-medium text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-lg shadow-lg transition duration-200 hover:from-green-500 hover:to-blue-500 hover:via-teal-500 focus:from-green-500 focus:to-blue-500 focus:via-teal-500 hover:shadow-xl"
                >
                  Publicar
                </button>
              </div>
            </div>

            <textarea
              className="w-[70%] min-h-[200px] px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition duration-200"
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Escribe aqui tu comentario y comparte tu opinión con otros usuarios! Pero por favor, evita hacer spoilers..."
            ></textarea>
          </form>
        </div>
      </div>
    </div>
  );
}

function Tagline({ movie }) {
  if (movie.tagline) {
    return (
      <q
        className={`block px-8 py-4 w-full text-3xl italic font-semibold text-right text-black`}
      >
        {movie.tagline}
      </q>
    );
  } else {
    return <span className="block py-4 text-3xl font-semibold">&nbsp;</span>;
  }
}
function CrewMember({ movie, job, label }) {
  const people = movie?.crew?.filter((p) => p.job === job);

  if (people?.length !== 0)
    return (
      <div>
        <dt className="text-sm font-bold">{label}</dt>
        {people?.map((p) => (
          <dd className="text-sm" key={`${job}/${p.id}`}>
            {p.name}
          </dd>
        ))}
      </div>
    );
  else return null;
}
function Links({ movie }) {
  const resources = movie?.resources?.filter(
    (r) => !["POSTER", "BACKDROP", "TRAILER"].includes(r.type)
  );
  let links;

  if (resources?.length === 0) {
    links = (
      <span className="block p-8 font-bold text-center bg-gray-300">
        No se han encontrado enlaces!
      </span>
    );
  } else {
    links = (
      <ul className="space-y-4">
        {resources?.map((r) => (
          <PlatformLink key={r.type} type={r.type} url={r.url} />
        ))}
      </ul>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold">Ver ahora</h2>
      <Separator />
      {links}
    </>
  );
}
function CastMember({ person }) {
  return (
    <li className="overflow-hidden">
      <img
        src={person?.picture}
        alt={`${person.name} profile`}
        className="object-cover object-top w-full rounded shadow"
        style={{ aspectRatio: "2/3" }}
      />
      <span className="block font-bold"> {person?.name} </span>
      <span className="block text-sm"> {person?.character} </span>
    </li>
  );
}
function PlatformLink({ type = "", url = "", ...props }) {
  switch (type) {
    case "DISNEY_PLUS":
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={url}
          className={`flex overflow-hidden items-center space-x-2 w-full h-16 bg-white transition duration-200 transform hover:translate-x-8 hover:scale-105`}
        >
          <img
            src={Disney}
            alt="Disney+ logo"
            className="w-16 h-16 rounded-lg"
          />
          <span className="font-bold">Reproducir en</span>
        </a>
      );
    case "GOOGLE_PLAY":
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={url}
          className={`flex overflow-hidden items-center space-x-2 w-full h-16 bg-white transition duration-200 transform hover:translate-x-8 hover:scale-105`}
        >
          <img
            src={Play}
            alt="Google Play logo"
            className="w-16 h-16 rounded-lg"
          />
          <span className="font-bold">Reproducir en Google Play</span>
        </a>
      );
    case "HBO":
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={url}
          className={`flex overflow-hidden items-center space-x-2 w-full h-16 bg-white transition duration-200 transform hover:translate-x-8 hover:scale-105`}
        >
          <img src={HBO} alt="HBO logo" className="w-16 h-16 rounded-lg" />
          <span className="font-bold">Reproducir en HBO</span>
        </a>
      );
    case "ITUNES":
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={url}
          className={`flex overflow-hidden items-center space-x-2 w-full h-16 bg-white transition duration-200 transform hover:translate-x-8 hover:scale-105`}
        >
          <img
            src={ITunes}
            alt="iTunes logo"
            className="w-16 h-16 rounded-lg"
          />
          <span className="font-bold">Reproducir en iTunes</span>
        </a>
      );
    case "NETFLIX":
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={url}
          className={`flex overflow-hidden items-center space-x-2 w-full h-16 bg-white transition duration-200 transform hover:translate-x-8 hover:scale-105`}
        >
          <img
            src={Netflix}
            alt="Netflix logo"
            className="w-16 h-16 rounded-lg"
          />
          <span className="font-bold">Reproducir en Netflix</span>
        </a>
      );
    case "PRIME_VIDEO":
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={url}
          className={`flex overflow-hidden items-center space-x-2 w-full h-16 bg-white transition duration-200 transform hover:translate-x-8 hover:scale-105`}
        >
          <img
            src={Prime}
            alt="Prime Video logo"
            className="w-16 h-16 rounded-lg"
          />
          <span className="font-bold">Reproducir en Prime Video</span>
        </a>
      );
    case "YOUTUBE":
      return (
        <a
          target="_blank"
          rel="noreferrer"
          href={url}
          className={`flex overflow-hidden items-center space-x-2 w-full h-16 bg-white transition duration-200 transform hover:translate-x-8 hover:scale-105`}
        >
          <img
            src={Youtube}
            alt="YouTube logo"
            className="w-16 h-16 rounded-lg"
          />
          <span className="font-bold">Reproducir en YouTube</span>
        </a>
      );
    default:
      return null;
  }
}

function Trailer({ movie, ...props }) {
  const trailer = movie?.resources?.find((r) => r.type === "TRAILER");

  if (trailer) return <ReactPlayer url={trailer.url} {...props} />;
  else
    return (
      <div className="flex justify-center items-center w-full h-full">
        <span className="p-8 text-xl font-semibold text-white bg-black backdrop-filter backdrop-blur">
          No se han encontrado trailers!
        </span>
      </div>
    );
}

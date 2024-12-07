import { Shell } from "../../components";
import { useComments, useUser } from "../../hooks";
import Rating from "../../components/Rating";
import { Separator } from "../../components";
import { Link } from "../../components";

export default function Profile() {
  const { user } = useUser(); // Obtenemos los datos del usuario

  //Solo renderizamos la página si el usuario ya ha sido cargado, para evitar errores
  if (!user) {
    return (
      <Shell>
        <div className="w-full p-8 mx-auto max-w-screen-2xl">
          <p className="text-lg text-center text-gray-500">
            Cargando perfil...
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="w-full p-8 mx-auto max-w-screen-2xl">
        <Header user={user} />
        <div className="flex justify-center mt-6">
          <Link
            to="/editProfile"
            className="px-6 py-3 font-bold text-white transition duration-200 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl"
          >
            Editar perfil
          </Link>
        </div>
        <Comments user={user} />
      </div>
    </Shell>
  );
}

function Header({ user }) {
  return (
    <header className="relative flex items-end pb-8 mt-6 min-h-[550px]">
      {/* Fondo difuminado como en la página de movies */}
      <img
        src="https://via.placeholder.com/1920x1080" // Imagen estática de fondo
        alt="Background"
        className="absolute top-0 left-0 right-0 object-cover w-full h-[450px] transform scale-105 filter blur"
      />

      <img
        // Poniendo ?. antes de la propiedad, se evita que se lance un error si la propiedad es null o undefined
        src={user?.picture || "https://via.placeholder.com/1920x1080"}
        alt={user?.name}
        className="relative object-cover w-64 h-64 border-4 border-white rounded-full shadow-xl"
      />

      {/*Información del usuario*/}
      <hgroup className="flex-1">
        <h1
          className={`bg-black bg-opacity-50 backdrop-filter backdrop-blur 
                                          text-right text-white text-6xl font-bold
                                          p-8`}
        >
          {user?.name}
        </h1>
        <div className="flex flex-row justify-between">
          {/* Fecha de nacimiento con ícono de calendario */}
          <div className="flex items-center gap-2 text-lg text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-calendar"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
            {user?.birthday
              ? `${user.birthday.day}/${user.birthday.month}/${user.birthday.year}`
              : "No disponible"}
          </div>

          {/* País con ícono de ubicación */}
          <div className="flex items-center gap-2 text-lg text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-map-pin"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {user?.country || "País no disponible"}
          </div>

          <p className="mt-2 text-lg text-gray-500">
            {user?.email || "Correo no disponible"}
          </p>
        </div>
      </hgroup>
    </header>
  );
}

//Recuperar los comments realizados por el usuario
function Comments({ user }) {
  const { comments = [] } = useComments({ filter: { user: user.email } });

  return (
    <div className="max-w-full mx-auto mt-16">
      <h2 className="mt-16 text-2xl font-bold">Últimos Comentarios</h2>
      <Separator />
      <div className="space-y-8">
        {comments._embedded === undefined ||
        comments._embedded.assessmentList === undefined ||
        comments._embedded.assessmentList.length === 0 ? (
          <p className="italic text-center text-gray-500">
            No has realizado comentarios aún.
          </p>
        ) : (
          comments._embedded.assessmentList.map((comment, index) => (
            <div
              key={index}
              className="p-6 mx-2 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              <div className="flex flex-row justify-between">
                <p className="mb-2">
                  <strong className="text-indigo-600">
                    {comment.movie.title}
                  </strong>
                </p>
                {/* Componente de puntuación */}
                <Rating rating={comment.rating} readonly={true} />
              </div>
              <p className="leading-relaxed text-gray-700 line-clamp-4">
                {comment.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

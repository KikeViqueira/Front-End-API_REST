import { Shell } from "../../components";
import { useUser } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function EditProfile() {
  const { user, update } = useUser(); // Obtenemos los datos del usuario
  const navigate = useNavigate();

  // Función para guardar los cambios en el perfil
  const handleSave = async ({ name, country, picture }) => {
    try {
      const patches = [];

      // Comprobamos si los distintos campos han sido modificados
      if (name && name !== user.name) {
        patches.push({
          op: user.name ? "replace" : "add",
          path: "/name",
          value: name,
        });
      }

      if (country && country !== user.country) {
        patches.push({
          op: user.country ? "replace" : "add",
          path: "/country",
          value: country,
        });
      }

      // Si la imagen es un archivo, la convertimos a base64
      if (picture instanceof File) {
        const base64Picture = await toBase64(picture);
        patches.push({
          op: user.picture ? "replace" : "add",
          path: "/picture",
          value: base64Picture,
        });
      }

      // Enviar los parches al backend solo si hay cambios
      if (patches.length > 0) {
        console.log("Parches enviados:", patches);
        await update(patches); // Llamada al hook `update`
      } else {
        console.log("No hay cambios que guardar.");
      }
      // Siempre navegamos al perfil, haya o no cambios
      navigate("/profile");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Convierte un archivo en base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  //Solo renderizamos la página si el usuario ya ha sido cargado, para evitar errores
  if (!user) {
    return (
      <Shell>
        <div className="p-8 mx-auto w-full max-w-screen-2xl">
          <p className="text-lg text-center text-gray-500">
            Cargando perfil...
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="p-8 pt-0 mx-auto">
        <Header user={user} onSave={handleSave} />
      </div>
    </Shell>
  );
}

function Header({ user, onSave }) {
  //Creamos los diferentes estados para los campos editables que tenemos
  const [name, setName] = useState(user?.name || "");
  const [country, setCountry] = useState(user?.country || "");
  const [picture, setPicture] = useState(user?.picture || null);

  useEffect(() => {
    if (picture instanceof File) {
      const objectUrl = URL.createObjectURL(picture);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [picture]);

  //Función para manejar la carga de una nueva imagen
  const handlePicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPicture(file);
    }
  };

  return (
    <header className="w-full relative flex items-end justify-center min-h-[650px]">
      {/* Fondo difuminado */}
      <div className={`absolute top-0 left-0 right-0 h-[500px] transform scale-105 blur-sm ${!picture ? 'bg-gray-200' : ''}`}>
        {picture && (
          <img
            src={picture instanceof File ? URL.createObjectURL(picture) : picture}
            alt="Background"
            className="object-cover w-full h-full"
          />
        )}
      </div>

      <div className="flex flex-row justify-center items-center w-[80%]">
        {/*Imagen que podemos cambiar de perfil*/}
        <div>
          <label
            htmlFor="profilePicture"
            className="relative cursor-pointer group"
          >
            <div className="relative">
              <div className={`w-64 h-64 rounded-full border-4 border-white shadow-xl transition-opacity group-hover:opacity-75 ${!picture ? 'bg-gray-300' : ''}`}>
                {picture && (
                  <img
                    src={
                      picture instanceof File
                        ? URL.createObjectURL(picture)
                        : picture
                    }
                    alt="Profile"
                    className="object-cover w-full h-full rounded-full"
                  />
                )}
              </div>
              <div className="flex absolute inset-0 justify-center items-center bg-black bg-opacity-0 rounded-full transition-all group-hover:bg-opacity-30">
                <span className="text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Cambiar foto
                </span>
              </div>
            </div>
          </label>
          <input
            type="file"
            id="profilePicture"
            className="hidden"
            accept="image/*"
            onChange={handlePicture}
          />
        </div>

        {/*Información del usuario*/}
        <hgroup className="flex flex-col flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="p-8 text-6xl font-bold text-right text-white bg-black bg-opacity-50 border-none backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex flex-row justify-between w-[90%] self-center mb-6">
            {/* Fecha de nacimiento con ícono de calendario */}
            <div className="flex gap-2 items-center text-lg text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-calendar"
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
            <div className="flex gap-2 items-center text-lg text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-map-pin"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Tu país"
                className="text-lg text-gray-500 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <p className="mt-2 text-lg text-gray-500">
              {user?.email || "Correo no disponible"}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-row gap-4 justify-center items-center">
            <Link
              to="/profile"
              className="px-4 py-2 font-semibold text-white bg-gray-600 rounded-lg shadow-lg transition duration-200 hover:bg-gray-700 hover:shadow-xl"
            >
              Volver al perfil
            </Link>
            <button
              onClick={() => onSave({ name, country, picture })}
              className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-lg transition duration-200 hover:bg-indigo-700 hover:shadow-xl"
            >
              Guardar cambios
            </button>
          </div>
        </hgroup>
      </div>
    </header>
  );
}

import { Shell } from "../../components";
import { useUser } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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

      // Enviar los parches al backend
      if (patches.length > 0) {
        console.log("Parches enviados:", patches);
        await update(patches); // Llamada al hook `update`
        navigate("/profile"); // Redirige al perfil
      } else {
        console.log("No hay cambios que guardar.");
      }
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
    <header className="relative flex items-end pb-8 mt-6 min-h-[650px]">
      {/* Fondo difuminado como en la página de movies */}
      <img
        src={picture instanceof File ? URL.createObjectURL(picture) : picture}
        alt="Background"
        className="absolute top-0 left-0 right-0 object-cover w-full h-[450px] transform scale-105 blur-sm"
      />
      {/* Overlay para oscurecer ligeramente el fondo */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-black opacity-30" />

      {/*Imagen que podemos cambiar de perfil*/}
      <div>
        <label
          htmlFor="profilePicture"
          className="cursor-pointer group relative"
        >
          <div className="relative">
            <img
              src={
                picture instanceof File ? URL.createObjectURL(picture) : picture
              }
              alt="Profile"
              className="relative object-cover w-64 h-64 border-4 border-white rounded-full shadow-xl transition-opacity group-hover:opacity-75"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
      <hgroup className="flex flex-col w-full gap-5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`bg-black bg-opacity-50 backdrop-filter backdrop-blur 
            text-right text-white text-6xl font-bold
            p-8`}
        />

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
            {/* País editable */}
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 text-lg text-gray-500 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <p className="mt-2 text-lg text-gray-500">
            {user?.email || "Correo no disponible"}
          </p>
        </div>

        {/* Botón para guardar cambios */}
        <button
          onClick={() => onSave({ name, country, picture })}
          className="px-6 py-3 mt-4 font-bold text-white transition duration-200 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700"
        >
          Guardar cambios
        </button>
      </hgroup>
    </header>
  );
}

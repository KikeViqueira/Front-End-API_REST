import { Shell, Separator } from "../../components";
import { useUser } from "../../hooks";
import { useFriends } from "../../hooks";
import { UserPlus, Search, Mail, UserCheck, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Friends() {
  const { user, fetchUser } = useUser();
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const { error: friendsError, addFriend, removeFriend } = useFriends();
  const [searchTerm, setSearchTerm] = useState("");
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [newFriendName, setNewFriendName] = useState("");
  const [error, setError] = useState("");

  // Función para actualizar los datos del usuario
  const updateUserData = async () => {
    if (user) {
      await fetchUser();
    }
  };

  //Cuando los datos del usuario cambian renderizamos el componente
  useEffect(() => {
    updateUserData();
  }, [user]);

  // Si el usuario no está cargado, mostrar pantalla de carga
  if (!user) {
    return (
      <Shell>
        <div className="flex justify-center items-center h-screen">
          <div className="w-32 h-32 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
        </div>
      </Shell>
    );
  }
  console.log("Usuario en amigos", user);
  // Obtener amigos del perfil del usuario
  const userFriends = user.friends || [];

  console.log(userFriends);

  const handleAddFriend = async () => {
    // Validaciones básicas
    if (!newFriendEmail || !newFriendName) {
      setError("Por favor, introduce el nombre y el email del amigo");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newFriendEmail)) {
      setError("Por favor, introduce un email válido");
      return;
    }

    // Verificar que no sea un amigo existente
    if (userFriends.some((friend) => friend.email === newFriendEmail)) {
      setError("Este amigo ya está en tu lista");
      return;
    }

    try {
      // Usar el hook para añadir amigo
      await addFriend(newFriendEmail, newFriendName);

      // Refrescar datos del usuario para obtener la lista actualizada de amigos
      await updateUserData();

      // Limpiar campos y errores
      setNewFriendEmail("");
      setNewFriendName("");
      setError("");
    } catch (err) {
      setError("Error al agregar amigo. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  const handleRemoveFriend = async (friendEmail) => {
    try {
      // Cuando el usuario elimina un amigo dándole al botón eliminamos al amigo de su lista de amigos
      await removeFriend(friendEmail);
      // Refrescar datos del usuario para obtener la lista actualizada de amigos
      await updateUserData();
      setError("");
    } catch (err) {
      setError("Error al eliminar amigo. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  return (
    <Shell>
      <header className="relative flex items-end pb-8 mt-6 min-h-[550px]">
        {/* Fondo difuminado */}
        <img
          src={user?.picture || "https://via.placeholder.com/1920x1080"}
          alt="Background"
          className="absolute top-0 left-0 right-0 object-cover w-full h-[450px] transform scale-105 blur-sm"
        />
        {/* Overlay para oscurecer ligeramente el fondo */}
        <div className="absolute top-0 left-0 right-0 h-[450px] bg-black opacity-30" />

        <div className="flex relative z-10 items-center space-x-6">
          <img
            src={user?.picture || "https://via.placeholder.com/150"}
            alt={user?.name}
            className="object-cover w-64 h-64 rounded-full border-4 border-white shadow-xl"
          />
          <hgroup className="flex-1">
            <h1 className="p-8 text-6xl font-bold text-right text-white bg-black bg-opacity-50 backdrop-blur-sm">
              Amigos de {user?.name}
            </h1>
          </hgroup>
        </div>
      </header>

      <div className="p-6 mx-auto space-y-8 max-w-4xl">
        {/* Sección para agregar amigos */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">Agregar Amigo</h2>
          <Separator />
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
            <div className="relative">
              <label
                htmlFor="friendName"
                className="block mb-2 text-sm font-medium"
              >
                Nombre
              </label>
              <input
                id="friendName"
                type="text"
                placeholder="Nombre del amigo"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="friendEmail"
                className="block mb-2 text-sm font-medium"
              >
                Email
              </label>
              <input
                id="friendEmail"
                type="email"
                placeholder="Email del amigo"
                value={newFriendEmail}
                onChange={(e) => setNewFriendEmail(e.target.value)}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="col-span-full">
              {(error || friendsError) && (
                <div className="mt-2 text-sm text-red-500">
                  {error || friendsError}
                </div>
              )}
              <button
                onClick={handleAddFriend}
                className="flex justify-center items-center px-4 py-2 mt-4 space-x-2 w-full text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                <UserPlus className="w-5 h-5" />
                <span>Agregar Amigo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sección de lista de amigos */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">
            Mis Amigos ({userFriends.length})
          </h2>
          <Separator />
          <div className="mt-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar amigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute top-3 right-3 text-gray-400" />
            </div>

            {userFriends.length === 0 ? (
              <div className="text-center text-gray-500">
                {searchTerm
                  ? "No se encontraron amigos que coincidan con la búsqueda"
                  : "No tienes amigos agregados aún"}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userFriends.map((friend) => (
                  <div
                    key={friend.email}
                    className="flex items-center p-4 space-x-4 bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg"
                  >
                    <img
                      src={friend.picture || "https://via.placeholder.com/150"}
                      alt={friend.name}
                      className="object-cover w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{friend.name}</h3>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <UserCheck className="text-green-500" />
                      <button
                        onClick={() => handleRemoveFriend(friend.email)}
                        className="text-red-500 transition-colors hover:text-red-700"
                        title="Eliminar amigo"
                      >
                        <UserMinus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

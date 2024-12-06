import { Shell, Separator } from "../../components";
import { useFriends, useUser } from "../../hooks";
import { UserX, UserCheck, UserPlus, UserMinus, Search } from "lucide-react";
import { useState } from "react";

export default function Friends() {
  const { friends, requests, loading, error, removeFriend } = useFriends();

  const { user, create, update } = useUser();

  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500">{error}</div>
        </div>
      </Shell>
    );
  }

  const filteredFriends = user.friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Shell>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Amigos</h1>
          <Separator />
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar amigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Añadir Amigo</span>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {friend.picture ? (
                      <img
                        src={friend.picture}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {friend.name[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{friend.name}</h3>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFriend(friend.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Eliminar amigo"
                  >
                    <UserMinus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? "No se encontraron amigos que coincidan con la búsqueda"
                : "No tienes amigos añadidos"}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

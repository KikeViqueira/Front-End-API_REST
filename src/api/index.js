import DATA from "./data";

let __instance = null;

export default class API {
  #token = sessionStorage.getItem("token") || null;

  static instance() {
    if (__instance == null) __instance = new API();

    return __instance;
  }

  async login(email, pass) {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
        // No necesitas 'credentials: "include"' si no usas cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Autenticación fallida");
      }
      console.log("Response:", response);
      const token = response.headers.get("Authorization");
      // Guardar el token para usarlo en futuras peticiones
      console.log("Token JWT:", token);
      // Guarda el token para futuras solicitudes
      localStorage.setItem("token", token);
      localStorage.setItem("user", email);
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  async logout() {
    this.#token = null;
    localStorage.clear();

    return true;
  }

  async findMovies({
    filter: { genre = "", title = "", status = "" },
    sort,
    pagination: { page = 0, size = 7 },
  } = {}) {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        title: title,
        genre: genre,
        status: status,
      });

      console.log("API findMovies - Params:", params.toString());
      console.log("API findMovies - Token:", token);

      const response = await fetch(`http://localhost:8080/movies?${params}`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las películas");
      }

      const data = await response.json();
      console.log("API findMovies - Response data:", data);

      return data;
    } catch (error) {
      console.error("Error al buscar películas:", error);
      return {
        content: [],
        pagination: { hasNext: false, hasPrevious: false },
      };
    }
  }

  async findMovie(id) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/movies/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener la película");
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async findUser(id) {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Error al obtener el usuario");
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      return null;
    }
  }

  async findComments({
    filter: { movie = "", user = "" } = { movie: "", user: "" },
    sort,
    pagination: { page = 0, size = 10 } = { page: 0, size: 10 },
  }) {
    console.log("Filter", movie);
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      console.log("MOVIE: ", movie);
      const response = await fetch(
        `http://localhost:8080/comments/movie/${movie}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los comentarios");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al buscar comentarios:", error);
      return {
        content: [],
        pagination: { hasNext: false, hasPrevious: false },
      };
    }
  }

  async createComment(comment) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(comment),
      });

      if (!response.ok) {
        throw new Error("Error al crear el comentario");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al crear comentario:", error);
      throw error;
    }
  }

  async createUser(user) {
    console.log(user);
  }

  async updateUser(id, user) {
    console.log(user);
  }

  async updateMovie(id, patches) {
    console.log("Patches en la api:", JSON.stringify(patches));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/movies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(patches),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la película");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al actualizar película:", error);
      throw error;
    }
  }

  async addFriend(userId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/friends/${userId}`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Error al añadir amigo");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al añadir amigo:", error);
      throw error;
    }
  }

  async removeFriend(userId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/friends/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar amigo");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
      throw error;
    }
  }
}

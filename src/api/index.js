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
      console.log("Usuario recibido desde la API:", user);
      return user;
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      return null;
    }
  }

  //Obtener los comentarios de una película o de un usuario
  async findComments({
    filter: { movie = "", user = "" } = { movie: "", user: "" },
    sort,
    pagination: { page = 0, size = 10 } = { page: 0, size: 10 },
  }) {
    console.log("Filter", movie);
    try {
      const token = localStorage.getItem("token");

      //Creamos los parámetros comunes de paginación
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      let url;

      //Determinamos el endpoint a llamar según el tipo de filtro proporcionado
      if (movie) {
        //Endpoint para obtener los comentarios de una película
        url = `http://localhost:8080/comments/movie/${movie}?${params}`;
      } else if (user) {
        //Endpoint para obtener los comentarios de un usuario
        url = `http://localhost:8080/comments/user/${user}?${params}`;
      } else {
        throw new Error("No se especificó un filtro válido (movie o user).");
      }

      console.log("FILTRO SELECCIONADO (MOVIE) (USER):", movie, user);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

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

  // Método para llamar al endpoint correspondiente de la api para la creación de un usuario
  async createUser(user) {
    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indica que el contenido del body es JSON
        },
        //Por defecto tenemos que hacer que todos los usuarios que se registren otorguen el rol de USER
        body: JSON.stringify({ ...user, roles: ["ROLE_USER"] }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el usuario");
      }

      return await response.json(); // Devuelve confirmación de que el usuario fue creado
    } catch (error) {
      console.error("Error al crear el usuario: ", error);
      throw error;
    }
  }

  // Método para llamar al endpoint correspondiente de la api para la actualización de un usuario
  async updateUser(id, patches) {
    try {
      console.log("Patches en la api:", JSON.stringify(patches));
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(patches),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }

      return await response.json();
    } catch (error) {
      console.error("Error al actualizar el usuario: ", error);
      throw error;
    }
  }

  // Método para llamar al endpoint correspondiente de la api para la actualización de una película
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

  async addFriend(email, name) {
    const userId = localStorage.getItem("user");
    console.log("En la api el userId: ", userId, name);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/users/${userId}/friends`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            email: email,
            name: name,
          }),
        }
      );

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

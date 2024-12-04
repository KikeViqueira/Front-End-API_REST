import { useEffect, useState } from "react";

import API from "../api";

export function useMovies(query = {}) {
  const [data, setData] = useState({
    _embedded: { movieList: [] },
    page: { totalPages: 1, number: 0 },
  });
  const queryString = JSON.stringify(query);

  useEffect(() => {
    API.instance()
      .findMovies(JSON.parse(queryString))
      .then((data) => {
        console.log("useMovies - Raw API response:", data);
        // La API devuelve directamente la estructura correcta, así que la usamos tal cual
        setData(data);
      })
      .catch((error) => {
        console.error("useMovies - Error:", error);
        setData({
          _embedded: { movieList: [] },
          page: { totalPages: 1, number: 0 },
        });
      });
  }, [queryString]);

  return data;
}

export function useMovie(id = "") {
  const [data, setData] = useState({});

  useEffect(() => {
    API.instance().findMovie(id).then(setData);
  }, [id]);

  return data;
}

export function useUser(id = null) {
  const [data, setData] = useState(null);
  const userId = id === null ? localStorage.getItem("user") : id;

  console.log("Ejecutando useUser", userId);

  useEffect(() => {
    if (userId) {
      API.instance()
        .findUser(userId)
        .then((user) => {
          if (!user) {
            console.log("No se encontro al user :(");
          } else {
            setData(user);
            console.log("user", user);
          }
        })
        .catch(() => {
          setData(null);
        });
    } else {
      setData(null);
    }
  }, []);

  const create = (user) =>
    API.instance()
      .createUser(user)
      .then((user) => setData(user));

  const update = (user) =>
    API.instance()
      .updateUser(id, user)
      .then((user) => setData(user));

  return {
    user: data,
    create,
    update,
  };
}

export function useComments(query = {}) {
  const [data, setData] = useState({
    content: [],
    pagination: { hasNext: false, hasPrevious: false },
  });
  const queryString = JSON.stringify(query);

  console.log("useComments - query:", query);
  console.log("useComments - queryString:", queryString);

  useEffect(() => {
    API.instance()
      .findComments(JSON.parse(queryString))
      .then((comments) => {
        if (!comments) {
          console.log("No se encontro al user :(");
        } else {
          setData(comments);
          console.log("Comments", comments);
        }
      });
  }, [queryString]);

  const create = (comment) => {
    comment.user = {
      email: localStorage.getItem("user"),
    };

    console.log("comment", comment);
    API.instance()
      .createComment(comment)
      .then(() => {
        API.instance().findComments(query).then(setData);
      });
  };

  return {
    comments: data,
    createComment: create,
  };
}

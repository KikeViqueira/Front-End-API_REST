import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ReactFontLoader from "react-font-loader";

import { SecuredApp, SecuredRoute } from "./context";
import Login from "./pages/login";
import Register from "./pages/registry";
import Movies from "./pages/movies";
import Movie from "./pages/movie";
import EditMovie from "./pages/edit-movie";
import CreateMovie from "./pages/create-movie";
import Profile from "./pages/profile";
import Friends from "./pages/friends";
//Añadimos la ruta de la página de editar información de usuario
import EditProfile from "./pages/editProfile";
import NotFound from "./pages/not-found";

import "./styles.css";

ReactDOM.render(
  <React.StrictMode>
    <SecuredApp>
      <ReactFontLoader url="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" />
      <ReactFontLoader url="https://fonts.googleapis.com/css2?family=Modak&display=swap" />
      <ReactFontLoader url="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/movies/new"
            element={
              <SecuredRoute>
                <CreateMovie />
              </SecuredRoute>
            }
          />
          <Route
            path="/movies/:id/edit"
            element={
              <SecuredRoute>
                <EditMovie />
              </SecuredRoute>
            }
          />
          <Route
            path="/movies/:id"
            element={
              <SecuredRoute>
                <Movie />
              </SecuredRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <SecuredRoute>
                <Movies />
              </SecuredRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <SecuredRoute>
                <Profile />
              </SecuredRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <SecuredRoute>
                <Friends />
              </SecuredRoute>
            }
          />
          {/* Añadimos la ruta de la página de editar información de usuario */}
          <Route
            path="/editProfile"
            element={
              <SecuredRoute>
                <EditProfile />
              </SecuredRoute>
            }
          />

          <Route
            path="/404"
            element={
              <SecuredRoute>
                <NotFound />
              </SecuredRoute>
            }
          />
          {/* Redirect to /movies from the root */}
          <Route path="/" element={<Navigate to="/movies" />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SecuredApp>
  </React.StrictMode>,
  document.getElementById("root")
);

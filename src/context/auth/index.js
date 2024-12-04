import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../api";

// Contexto de autenticación
const AuthenticationContext = React.createContext({
  isAuthenticated: false,
  errors: false,
  login: () => {},
  logout: () => {},
  reset: () => {},
});
const client = API.instance();

function SecuredApp({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem("authenticated") || false)
  );
  const [errors, setErrors] = useState(false);

  const reset = async () => {
    localStorage.setItem("authenticated", JSON.stringify(false));
    setErrors(false);
    setIsAuthenticated(false);
  };

  const login = async (user, pass) => {
    const loginSuccessful = await client.login(user, pass);
    localStorage.setItem("authenticated", JSON.stringify(loginSuccessful));
    setIsAuthenticated(loginSuccessful);
    setErrors(!loginSuccessful);
  };

  const logout = async () => {
    await client.logout();
    await reset();
  };

  const context = { isAuthenticated, login, logout, errors, reset };

  return (
    <AuthenticationContext.Provider value={context}>
      {children}
    </AuthenticationContext.Provider>
  );
}

// Componente SecuredRoute para protección de rutas
function SecuredRoute({ children }) {
  const { isAuthenticated } = useContext(AuthenticationContext);

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, muestra los hijos
  return children;
}

export { AuthenticationContext, SecuredApp, SecuredRoute };

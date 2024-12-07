import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { AuthenticationContext } from "../../context";

import { Logo, Link, Input, Button } from "../../components";
import { useUser } from "../../hooks";
import { AtSign, Fingerprint, User, Calendar } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthenticationContext);
  const { create } = useUser();
  const [errors, setErrors] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const birthday = data.get("birthday");

    try {
      const [day, month, year] = birthday
        .split(/[^0-9]/) // Separa la fecha en partes usando cualquier caracter que no sea un número
        .map((part) => Number.parseInt(part));
      const date = new Date(year, month - 1, day);

      ///debugger;

      if (
        //Compara si la fecha es igual a la fecha ingresada
        date.getDate() !== day ||
        date.getMonth() !== month - 1 ||
        date.getFullYear() !== year
      ) {
        setErrors(true);
      } else {
        //Invocamos a la función create del hook useUser para crear el nuevo usuario pasándole los datos del form
        await create({
          email: data.get("user"),
          name: data.get("name"),
          password: data.get("password"),
          birthday: {
            day,
            month,
            year,
          },
        });

        //Redirigimos al usuario a la página principal después del registro exitoso
        navigate("/");
      }
    } catch (err) {
      setErrors(true);
    }
  };

  const reset = () => {
    setErrors(false);
  };

  if (isAuthenticated) return <Navigate to="/" />;
  else
    return (
      <main className="grid content-center w-screen h-screen place-items-center bg-pattern-1">
        <form
          className="flex flex-col p-8 text-teal-900 bg-white rounded shadow"
          onSubmit={submit}
          autoComplete="off"
        >
          <Logo className="mb-8 text-6xl" logoSize="w-12 h-12" />
          <Input
            type="email"
            name="user"
            label="Email"
            labelClassName="mb-4"
            errors={errors}
            onClick={reset}
            before={AtSign}
            variant="primary"
          />
          <Input
            type="text"
            name="name"
            label="Nombre"
            labelClassName="mb-4"
            errors={errors}
            onClick={reset}
            before={User}
            variant="primary"
          />
          <Input
            type="text"
            name="birthday"
            label="Fecha de nacimiento"
            labelClassName="mb-4"
            errors={errors}
            onClick={reset}
            before={Calendar}
            variant="primary"
            placeholder="DD/MM/YYYY"
            pattern="[0-3][0-9]/[0-1][0-9]/[1-2][0-9]{3}"
          />
          <Input
            type="password"
            name="password"
            label="Contraseña"
            labelClassName="mb-8"
            errors={errors}
            onClick={reset}
            before={Fingerprint}
            variant="primary"
          />
          <Button className="mt-8" type="submit" variant="secondary">
            Registrar
          </Button>
        </form>
        <Link to="/login" variant="plain-secondary">
          Iniciar sesión
        </Link>
      </main>
    );
}

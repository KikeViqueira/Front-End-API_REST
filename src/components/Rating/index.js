import { useEffect, useState } from "react";

//Añadimos una propiedad para saber si el componente es de solo lectura (Caso de recuperar los datos en el comentario de un usuario)
function Rating({
  onRatingChange,
  rating: initialRating = 0,
  readonly = true,
}) {
  const [rating, setRating] = useState(initialRating); //Estado para almacenar la puntuación

  useEffect(() => {
    setRating(initialRating); // Sincroniza cuando `initialRating` cambia
  }, [initialRating]);

  const handleRating = (event, value) => {
    if (!readonly) {
      //Si readonly es false, entonces se puede cambiar la puntuación
      event.preventDefault(); //Evitamos la recarga de la página cuando se hace click en un botón de la puntuación
      setRating(value); //Actualizamos el estado con el valor del rating
      onRatingChange && onRatingChange(value); //Si existe la función onRatingChange, la invocamos pasándole el valor del rating
    }
  };

  return (
    <div className="flex space-x-2">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
        <button
          key={value}
          onClick={(e) => handleRating(e, value)}
          className={`w-7 h-7 rounded-full border ${
            //Si el valor del botón es menor o igual al rating, le asignamos el color amarillo, de lo contrario, le asignamos el color gris

            value <= rating
              ? "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"
              : "bg-gray-300"
          }`}
          disabled={readonly}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

export default Rating;

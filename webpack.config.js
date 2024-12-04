const path = require("path");

module.exports = {
  entry: "./src/index.js", // Ajusta la ruta de tu archivo de entrada si es necesario
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!@graywolfai\/react-heroicons)/, // Excepción para el paquete específico
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      // Aquí podrías agregar más reglas, como para manejar CSS, imágenes, etc.
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Asegúrate de que Webpack resuelva archivos .jsx
  },
  devtool: "source-map", // Opcional, solo para depuración
};

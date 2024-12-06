import { useParams, useNavigate } from "react-router-dom";
import { CircleChevronLeft as Back, Save, Plus } from "lucide-react";
import ReactPlayer from "react-player";
import { useState, useEffect } from "react";

import { Shell, Link, Separator } from "../../components";
import { useMovie } from "../../hooks";

import Disney from "../movie/icons/disney_plus.png";
import Play from "../movie/icons/google_play.png";
import HBO from "../movie/icons/hbo.png";
import ITunes from "../movie/icons/itunes.png";
import Netflix from "../movie/icons/netflix.png";
import Prime from "../movie/icons/prime_video.png";
import Youtube from "../movie/icons/youtube.png";

const backdrop = (movie) => {
  const backdrop = movie?.resources?.find(
    (res) => res?.type === "BACKDROP"
  )?.url;
  const poster = movie?.resources?.find((res) => res?.type === "POSTER")?.url;

  return backdrop ? backdrop : poster;
};

const poster = (movie) =>
  movie?.resources?.find((res) => res?.type === "POSTER")?.url;

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, update } = useMovie(id);
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    tagline: "",
    resources: [],
    cast: [],
    crew: [],
    links: [],
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        overview: movie.overview || "",
        tagline: movie.tagline || "",
        resources: movie.resources || [],
        cast: movie.cast || [],
        crew: movie.crew || [],
        links: movie.links || [],
      });
    }
  }, [movie]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResourceChange = (resources) => {
    setFormData((prev) => ({
      ...prev,
      resources,
    }));
  };

  const handleLinkChange = (links) => {
    setFormData((prev) => ({
      ...prev,
      links,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const patches = [];

      // Title patch
      if (formData.title !== movie.title) {
        patches.push({
          op: "replace",
          path: "/title",
          value: formData.title,
        });
      }

      // Overview patch
      if (formData.overview !== movie.overview) {
        patches.push({
          op: "replace",
          path: "/overview",
          value: formData.overview,
        });
      }

      // Tagline patch
      if (formData.tagline !== movie.tagline) {
        patches.push({
          op: "replace",
          path: "/tagline",
          value: formData.tagline,
        });
      }

      // Resources patch
      const trailerChanged =
        JSON.stringify(formData.resources) !== JSON.stringify(movie.resources);
      if (trailerChanged) {
        patches.push({
          op: "replace",
          path: "/resources",
          value: formData.resources,
        });
      }

      /*
      // Links patch
      const linksChanged =
        JSON.stringify(formData.links) !== JSON.stringify(movie.links);
      if (linksChanged) {
        patches.push({
          op: "replace",
          path: "/links",
          value: formData.links,
        });
        
      }
        */

      if (patches.length > 0) {
        console.log("Patches:", patches);
        await update(patches);
      }
      navigate(`/movies/${id}`);
    } catch (error) {
      console.error("Error al actualizar la película:", error);
    }
  };

  return (
    <Shell>
      <img
        style={{ height: "36rem" }}
        src={backdrop(movie)}
        alt={`${formData.title} backdrop`}
        className="absolute top-2 left-0 right-0 w-full object-cover filter blur transform scale-105"
      />

      <Link
        variant="primary"
        className="rounded-full absolute text-white top-4 left-8 flex items-center pl-2 pr-4 py-2 gap-4"
        to={`/movies/${id}`}
      >
        <Back className="w-8 h-8" />
        <span>Volver</span>
      </Link>

      <button
        onClick={handleSubmit}
        className="rounded-full absolute text-white top-4 right-8 flex items-center px-4 py-2 gap-4 bg-indigo-600 hover:bg-indigo-700"
      >
        <Save className="w-6 h-6" />
        <span>Guardar</span>
      </button>

      <div className="mx-auto w-full max-w-screen-2xl p-8">
        <Header
          movie={movie}
          formData={formData}
          onChange={handleInputChange}
        />
        <Info movie={movie} formData={formData} onChange={handleInputChange} />
        <View
          movie={movie}
          formData={formData}
          onChange={handleResourceChange}
          onLinkChange={handleLinkChange}
        />
        <Cast movie={movie} />
      </div>
    </Shell>
  );
}

function Header({ movie, formData, onChange }) {
  return (
    <header className="mt-64 relative flex items-end pb-8 mb-8">
      <img
        style={{ aspectRatio: "2/3" }}
        src={poster(movie)}
        alt={`${formData.title} poster`}
        className="w-64 rounded-lg shadow-xl z-20"
      />
      <hgroup className="flex-1">
        <div
          className={`bg-black bg-opacity-50 backdrop-filter backdrop-blur 
                     text-right text-white p-8`}
        >
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            className="text-6xl font-bold bg-transparent border-b border-white w-full text-right focus:outline-none focus:border-indigo-500"
            placeholder="Título de la película"
          />
        </div>
        <Tagline formData={formData} onChange={onChange} />
      </hgroup>
    </header>
  );
}

function Info({ movie, formData, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-4">
        <h2 className="font-bold text-2xl text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-4 shadow">
          Argumento
        </h2>
        <textarea
          name="overview"
          value={formData.overview}
          onChange={onChange}
          className="w-full pt-8 p-4 min-h-[200px] bg-transparent border rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Escribe aquí el argumento de la película..."
        />
      </div>
      <div className="text-right">
        <dl className="space-y-2">
          <CrewMember movie={movie} job="Director" label="Dirección" />
          <CrewMember movie={movie} job="Producer" label="Producción" />
          <CrewMember movie={movie} job="Screenplay" label="Guión" />
          <CrewMember
            movie={movie}
            job="Original Music Composer"
            label="Banda sonora"
          />
        </dl>
      </div>
    </div>
  );
}

function View({ movie, formData, onChange, onLinkChange }) {
  const handleResourceChange = (resources) => onChange(resources);
  const handleLinkChange = (links) => onLinkChange(links);

  return (
    <div className="flex gap-4 mt-8">
      <div className="w-80 z-10">
        <Links
          movie={movie}
          formData={formData}
          onLinkChange={handleLinkChange}
        />
      </div>
      <div
        style={{
          aspectRatio: "16/9",
        }}
        className="flex-1 ml-8 mt-8 bg-pattern-2 flex flex-col items-center justify-center z-20 p-4"
      >
        <Trailer
          movie={movie}
          formData={formData}
          onResourceChange={handleResourceChange}
        />
      </div>
    </div>
  );
}

function Cast({ movie }) {
  return (
    <>
      <h2 className="mt-16 font-bold text-2xl">Reparto principal</h2>
      <Separator />
      <ul className="w-full grid grid-cols-10 gap-2 overflow-hidden">
        {movie?.cast?.slice(0, 10).map((person) => (
          <CastMember key={person.name} person={person} />
        ))}
      </ul>
    </>
  );
}

function Tagline({ formData, onChange }) {
  return (
    <input
      type="text"
      name="tagline"
      value={formData.tagline}
      onChange={onChange}
      className="w-full text-right text-white text-xl mt-4 bg-black bg-opacity-50 backdrop-filter backdrop-blur p-4 focus:outline-none focus:border-indigo-500 border-b border-transparent hover:border-white"
      placeholder="Tagline de la película..."
    />
  );
}

function CrewMember({ movie, job, label }) {
  const member = movie?.crew?.find((m) => m.job === job);

  return member ? (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="font-medium">{member.name}</dd>
    </div>
  ) : null;
}

function Links({ movie, formData, onLinkChange }) {
  const [newLink, setNewLink] = useState({ platform: "", url: "" });
  const platforms = {
    DISNEY_PLUS: {
      name: "Disney+",
      icon: Disney,
      className: "bg-[#293B7A] hover:bg-[#1D2B5E]",
    },
    GOOGLE_PLAY: {
      name: "Google Play",
      icon: Play,
      className: "bg-[#202124] hover:bg-black",
    },
    HBO: {
      name: "HBO Max",
      icon: HBO,
      className: "bg-[#2B1464] hover:bg-[#1D0D45]",
    },
    ITUNES: {
      name: "iTunes",
      icon: ITunes,
      className: "bg-[#1D1D1F] hover:bg-black",
    },
    NETFLIX: {
      name: "Netflix",
      icon: Netflix,
      className: "bg-[#E50914] hover:bg-[#B2070F]",
    },
    PRIME_VIDEO: {
      name: "Prime Video",
      icon: Prime,
      className: "bg-[#1A242E] hover:bg-[#131B23]",
    },
    YOUTUBE: {
      name: "YouTube",
      icon: Youtube,
      className: "bg-[#FF0000] hover:bg-[#CC0000]",
    },
  };

  const handleAddLink = () => {
    if (newLink.platform && newLink.url) {
      const updatedLinks = [
        ...(formData.links || []).filter(
          (link) => link.platform !== newLink.platform
        ),
        { platform: newLink.platform, url: newLink.url },
      ];
      onLinkChange(updatedLinks);
      setNewLink({ platform: "", url: "" });
    }
  };

  const handleRemoveLink = (platform) => {
    const updatedLinks = (formData.links || []).filter(
      (link) => link.platform !== platform
    );
    onLinkChange(updatedLinks);
  };

  return (
    <div className="space-y-4 ">
      <div>
        <h2 className="font-bold text-2xl">Ver Ahora</h2>
        <Separator />
      </div>

      <div className="flex gap-2  items-start ">
        <select
          value={newLink.platform}
          onChange={(e) =>
            setNewLink((prev) => ({ ...prev, platform: e.target.value }))
          }
          className="flex w-[30%] px-3 py-2 h-8 rounded-md text-sm bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white focus:outline-none"
        >
          <option value="">Seleccionar plataforma</option>
          {Object.entries(platforms).map(([key, info]) => (
            <option key={key} value={key}>
              {info.name}
            </option>
          ))}
        </select>
        <input
          type="url"
          value={newLink.url}
          onChange={(e) =>
            setNewLink((prev) => ({ ...prev, url: e.target.value }))
          }
          placeholder="URL de la plataforma"
          className="flex px-3 py-2 h-8 rounded-md text-sm bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 bg-opacity-10 text-white placeholder-white placeholder-opacity-75 focus:outline-none"
        />
        <button
          onClick={handleAddLink}
          className="p-2 h-8 rounded-md bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mt-4">
        {formData.links?.map((link) => {
          const platform = platforms[link.platform];
          if (!platform) return null;
          return (
            <div
              key={link.platform}
              className="flex items-center gap-2 p-2 h-5 rounded-lg bg-white shadow"
            >
              <img
                src={platform.icon}
                alt={platform.name}
                className="h-6 object-contain"
              />
              <span className="flex-1 text-sm truncate">{link.url}</span>
              <button
                onClick={() => handleRemoveLink(link.platform)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Trailer({ movie, formData, onResourceChange }) {
  const [newTrailerUrl, setNewTrailerUrl] = useState("");

  const handleTrailerChange = (url) => {
    const updatedResources = [
      ...(formData.resources || []).filter((res) => res.type !== "TRAILER"),
      ...(url ? [{ type: "TRAILER", url }] : []),
    ];
    onResourceChange(updatedResources);
    setNewTrailerUrl("");
  };

  return (
    <div className="w-full h-full relative">
      {formData.resources?.find((res) => res?.type === "TRAILER")?.url ? (
        <ReactPlayer
          url={formData.resources?.find((res) => res?.type === "TRAILER")?.url}
          controls
          width="100%"
          height="100%"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 relative">
          <div className="absolute top-4 left-4 right-4">
            <input
              type="url"
              value={newTrailerUrl}
              onChange={(e) => setNewTrailerUrl(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleTrailerChange(newTrailerUrl)
              }
              placeholder="URL del trailer (YouTube, Vimeo...)"
              className="w-full px-3 py-2 rounded-md text-sm bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white placeholder-white placeholder-opacity-75 focus:outline-none"
            />
          </div>
          No hay trailer disponible
        </div>
      )}
      {formData.resources?.find((res) => res?.type === "TRAILER")?.url && (
        <div className="absolute top-4 left-4 right-4 flex gap-2">
          <input
            type="url"
            value={newTrailerUrl}
            onChange={(e) => setNewTrailerUrl(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleTrailerChange(newTrailerUrl)
            }
            placeholder="Cambiar URL del trailer"
            className="w-full px-3 py-2 rounded-md text-sm bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white placeholder-white placeholder-opacity-75 focus:outline-none"
          />
          <button
            onClick={() => handleTrailerChange("")}
            className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

function CastMember({ person }) {
  return (
    <li className="text-center">
      <img
        src={person.picture}
        alt={person.name}
        className="w-full aspect-[2/3] object-cover rounded mb-2"
      />
      <h3 className="font-medium text-sm">{person.name}</h3>
      <p className="text-sm text-gray-500">{person.character}</p>
    </li>
  );
}

function PlatformLink({ type = "", url = "", ...props }) {
  const platforms = {
    DISNEY_PLUS: {
      name: "Disney+",
      icon: Disney,
      className: "bg-[#293B7A] hover:bg-[#1D2B5E]",
    },
    GOOGLE_PLAY: {
      name: "Google Play",
      icon: Play,
      className: "bg-[#202124] hover:bg-black",
    },
    HBO: {
      name: "HBO Max",
      icon: HBO,
      className: "bg-[#2B1464] hover:bg-[#1D0D45]",
    },
    ITUNES: {
      name: "iTunes",
      icon: ITunes,
      className: "bg-[#1D1D1F] hover:bg-black",
    },
    NETFLIX: {
      name: "Netflix",
      icon: Netflix,
      className: "bg-[#E50914] hover:bg-[#B2070F]",
    },
    PRIME_VIDEO: {
      name: "Prime Video",
      icon: Prime,
      className: "bg-[#1A242E] hover:bg-[#131B23]",
    },
    YOUTUBE: {
      name: "YouTube",
      icon: Youtube,
      className: "bg-[#FF0000] hover:bg-[#CC0000]",
    },
  };

  const platform = platforms[type];

  if (!platform || !url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full rounded-lg ${platform.className} transition-colors p-4`}
    >
      <img
        src={platform.icon}
        alt={platform.name}
        className="h-8 object-contain"
      />
    </a>
  );
}

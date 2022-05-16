import type { Actor } from "./Actor";
import type { Director } from "./Director";
import type { Video } from "./Video";

type Collection = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type MovieItem = {
  title: string;
  original_title: string;
  tagline: string;
  genres: string[];
  overview: string;
  popularity: number;
  release_date: number;
  cast: Actor[];
  directors: Director[];
  runtime: number;
  vote_average: number;
  backdrop_path: string;
  belongs_to_collection: Collection[];
  budget: number;
  original_language: string;
  poster_path: string;
  spoken_languages: string[];
  status: string;
  videos: Video[];
  record_type: "movie";
};

import type { Actor } from "./Actor";
import type { Director } from "./Director";
import type { Video } from "./Video";

type Season = {
  air_date: number;
  episode_count: number;
  name: string;
  overview: string | null;
  poster_path: string;
  season_number: number;
};

type Episode = {
  air_date: number;
  episode_number: number;
  name: string;
  overview: string | null;
  season_number: number;
  still_path: string | null;
  vote_average: number;
};

type Network = {
  name: string;
  facet: string;
};

export type ShowItem = {
  title: string;
  tagline: string;
  genres: string[];
  overview: string | null;
  popularity: number;
  cast: Actor[];
  directors: Director[];
  vote_average: number;
  backdrop_path: string;
  created_by: Director[];
  in_production: boolean;
  languages: string[];
  first_air_date: number;
  last_air_date: number;
  next_episode_to_air: Episode | null;
  last_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  poster_path: string;
  seasons: Season[];
  spoken_languages: string[];
  status: string;
  videos: Video[];
  type: string;
  record_type: "show";
};

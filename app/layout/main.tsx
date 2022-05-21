import React, { Fragment } from "react";
import type { AutocompleteComponents } from "@algolia/autocomplete-js";
import { getAlgoliaFacets, getAlgoliaResults } from "@algolia/autocomplete-js";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Link } from "@remix-run/react";
import gravatar from "gravatar";
import type { Hit } from "instantsearch.js";
import { useNavigate } from "react-router";
import { useSearchParams } from "remix";

import { cx, getUrl, isMovie, isShow } from "~/utils";
import { WebflixLogo } from "~/components/logos/webflix";
import type { ReturnedGetUser } from "~/session.server";
import { Autocomplete } from "~/components/autocomplete";
import { searchClient } from "~/search-client";
import {
  ALGOLIA_FILTERS,
  ALGOLIA_INDEX_NAME,
  TMDB_IMAGE_BASE_URL,
} from "~/constants";
import { ImageWithLoader } from "~/components/image-with-loader";
import type { MovieItem } from "~/types/MovieItem";
import type { ShowItem } from "~/types/ShowItem";
import type { ActorItem } from "~/types/ActorItem";
import { YouTubeVideo } from "~/components/youtube-video";
import { CornerDownLeft } from "~/components/icons/corner-down-left";
import type { ReturnedGetFavoriteShows } from "~/models/show.server";
import type {
  Credit,
  Episode,
  Genre,
  Person,
  Season,
  Show,
  Video,
} from "@prisma/client";

type MainProps = {
  children?: React.ReactNode;
  user?: ReturnedGetUser;
  favoriteShows?: ReturnedGetFavoriteShows;
};

const navigation = [
  { name: "Discover", href: "/", current: true },
  { name: "Browse", href: "/", current: false },
  { name: "Watchlist", href: "/", current: false },
];

export function Main({ children, user, favoriteShows }: MainProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialQuery = searchParams?.get("q") || "";

  return (
    <div className="relative min-h-full bg-gray-900">
      <header className="fixed top-0 z-30 w-full">
        <div>
          <Disclosure
            as="nav"
            className="bg-gradient-to-b from-gray-900 to-transparent"
          >
            {({ open }) => (
              <>
                <div className="container mx-auto px-2 sm:px-6 lg:px-8">
                  <div className="relative flex h-20 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                      {/* Mobile menu button*/}
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white/50 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                      <Link
                        to={{ pathname: "/" }}
                        className="flex flex-shrink-0 items-center"
                      >
                        <WebflixLogo className="h-6 text-red-600" />
                      </Link>
                      <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              to={{ pathname: item.href }}
                              className={cx(
                                item.current
                                  ? "font-medium text-white"
                                  : "text-white/50 hover:text-white",
                                "px-3 py-2 text-sm transition-colors"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                      <Autocomplete
                        openOnFocus={true}
                        detachedMediaQuery=""
                        defaultActiveItemId={0}
                        placeholder="Search for movies, shows, actors, etc."
                        initialState={{ query: initialQuery }}
                        getSources={({ query }) => {
                          if (query.length === 0 && favoriteShows) {
                            return [
                              {
                                sourceId: "new_sesons",
                                getItems() {
                                  return favoriteShows.map((show) =>
                                    showToAlgoliaRecord(show as any)
                                  );
                                },
                                templates: {
                                  header() {
                                    return (
                                      <>
                                        <Heading>Suggestions for you</Heading>
                                        <SourceHeading>
                                          New seasons of shows you like
                                        </SourceHeading>
                                      </>
                                    );
                                  },
                                  item({ item, components }) {
                                    return (
                                      <MovieOrShowItem
                                        item={item as any}
                                        components={components}
                                      />
                                    );
                                  },
                                },
                              },
                            ];
                          }

                          if (query.length === 0 && !user) {
                            return [];
                          }

                          return [
                            {
                              sourceId: "movies_and_shows",
                              getItems() {
                                return getAlgoliaResults({
                                  searchClient,
                                  queries: [
                                    {
                                      indexName: ALGOLIA_INDEX_NAME,
                                      query,
                                      params: {
                                        hitsPerPage: 4,
                                        attributesToSnippet: ["overview:20"],
                                        snippetEllipsisText: "…",
                                        filters: ALGOLIA_FILTERS,
                                      },
                                    },
                                  ],
                                });
                              },
                              onSelect({ item }) {
                                if (item.objectID) {
                                  navigate(
                                    getUrl(item as Hit<ShowItem | MovieItem>)
                                  );
                                }
                              },
                              templates: {
                                header() {
                                  return (
                                    <>
                                      <Heading>Results for "{query}"</Heading>
                                      <SourceHeading>
                                        Movies and shows
                                      </SourceHeading>
                                    </>
                                  );
                                },
                                item({ item, components }) {
                                  return (
                                    <MovieOrShowItem
                                      item={item as Hit<ShowItem | MovieItem>}
                                      components={components}
                                    />
                                  );
                                },
                              },
                            },
                            {
                              sourceId: "all_results",
                              getItems() {
                                return [
                                  {
                                    text: `All results for "${query}"`,
                                  },
                                ];
                              },
                              onSelect() {
                                navigate(`/search/?q=${query}`);
                              },
                              templates: {
                                item({ item }) {
                                  return (
                                    <div className="cursor-default select-none rounded-md p-3 text-sm text-gray-400 aria-selected:bg-gray-800/80 aria-selected:text-white">
                                      <a
                                        className="flex items-center justify-between space-x-4"
                                        href={`/search/?q=${query}`}
                                      >
                                        <div>
                                          {(item as { text: string }).text}
                                        </div>
                                        <CornerDownLeft className="h-6 w-5 flex-none text-gray-400 transition-opacity aria-selected:opacity-100 aria-unselected:opacity-0" />
                                      </a>
                                    </div>
                                  );
                                },
                              },
                            },
                            {
                              sourceId: "actors",
                              getItems() {
                                return getAlgoliaFacets({
                                  searchClient,
                                  queries: [
                                    {
                                      indexName: ALGOLIA_INDEX_NAME,
                                      facet: "cast.facet",
                                      params: {
                                        facetQuery: query,
                                        maxFacetHits: 10,
                                      },
                                    },
                                  ],
                                  transformResponse({ facetHits }) {
                                    return facetHits[0].filter(
                                      (hit) => hit.label.split("||")[1]
                                    );
                                  },
                                });
                              },
                              templates: {
                                header() {
                                  return <SourceHeading>Actors</SourceHeading>;
                                },
                                item({ item }) {
                                  return (
                                    <ActorOrDirectorItem
                                      item={item as ActorItem}
                                    />
                                  );
                                },
                              },
                            },
                          ];
                        }}
                        render={(
                          { children, render, state, components },
                          root
                        ) => {
                          const { collections, activeItemId } = state;
                          const items = collections.reduce<
                            Array<Hit<MovieItem | ShowItem>>
                          >((acc, curr) => {
                            return acc.concat(
                              curr.items as Array<Hit<MovieItem | ShowItem>>
                            );
                          }, []);

                          const current =
                            activeItemId !== null && items[activeItemId];

                          render(
                            items.length > 0 ? (
                              <>
                                <div className="flex flex-1 divide-x divide-gray-500 divide-opacity-20">
                                  <div className="relative h-[36rem] min-w-0 flex-auto scroll-py-4 overflow-y-auto px-4 pt-4">
                                    {children}
                                    <div className="pointer-events-none sticky bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-900" />
                                  </div>
                                  {current &&
                                    (isMovie(current) || isShow(current)) && (
                                      <MovieOrShowPreview
                                        item={current}
                                        components={components}
                                        type={
                                          isMovie(current)
                                            ? "Movie"
                                            : "TV Series"
                                        }
                                      />
                                    )}
                                </div>
                                <div className="flex flex-none flex-wrap items-center space-x-2 px-4 py-3 text-xs text-gray-600">
                                  <span>Type</span>
                                  <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border border-gray-600 font-semibold">
                                    <CornerDownLeft className="h-3 w-3" />
                                  </kbd>
                                  <span>to select</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1">
                                      <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border border-gray-600 font-semibold">
                                        <ArrowDownIcon className="h-3 w-3" />
                                      </kbd>
                                      <kbd className="mx-1 flex h-5 w-5 items-center justify-center rounded border border-gray-600 font-semibold">
                                        <ArrowUpIcon className="h-3 w-3" />
                                      </kbd>
                                    </div>
                                    <span>to navigate</span>
                                  </div>
                                  <kbd className="mx-1 flex h-5 w-8 items-center justify-center rounded border border-gray-600 text-xs tracking-tighter">
                                    esc
                                  </kbd>
                                  <span>to close</span>
                                </div>
                              </>
                            ) : null,
                            root
                          );
                        }}
                      />

                      {user ? (
                        <Menu as="div" className="relative ml-3 flex-none">
                          <div>
                            <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 flex-none rounded-full"
                                src={gravatar.url(user.email)}
                                alt={user.email}
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cx(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Your profile
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cx(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Settings
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <form action="/logout" method="post">
                                    <button
                                      type="submit"
                                      className={cx(
                                        active ? "bg-gray-100" : "",
                                        "block w-full px-4 py-2 text-left text-sm text-gray-700"
                                      )}
                                    >
                                      Sign out
                                    </button>
                                  </form>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      ) : (
                        <Link
                          to={{ pathname: "/login" }}
                          className="ml-3 whitespace-nowrap rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:bg-red-400"
                        >
                          Sign in
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="sm:hidden">
                  <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={cx(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </header>
      {children}
    </div>
  );
}

type MovieOrShowItemProps = {
  item: Hit<ShowItem | MovieItem>;
  components: AutocompleteComponents;
};

function MovieOrShowItem({ item, components }: MovieOrShowItemProps) {
  const url = getUrl(item);
  const timestamp = isMovie(item) ? item.release_date : item.first_air_date;

  return (
    <div className="cursor-default select-none rounded-md p-3 text-sm text-gray-400 aria-selected:bg-gray-800/80 aria-selected:text-white">
      <a className="flex items-center justify-between space-x-4" href={url}>
        <div className="flex items-stretch space-x-4">
          <div className="relative w-12 flex-none overflow-hidden rounded-sm">
            <ImageWithLoader
              src={`${TMDB_IMAGE_BASE_URL}original${item.poster_path}`}
              className="absolute inset-0 transition-colors"
              alt={item.title}
              fallback={({ isLoading }) => (
                <div
                  className={cx(
                    "absolute inset-0 bg-gray-700 transition-colors",
                    isLoading ? "animate-pulse opacity-100" : "opacity-0"
                  )}
                />
              )}
            />
          </div>

          <div className="flex flex-col justify-between">
            <h2 className="font-semibold text-white line-clamp-1">
              <div className="child-mark:bg-transparent child-mark:text-red-600 child-mark:underline-offset-2 child-mark:aria-selected:underline">
                <components.Highlight hit={item} attribute="title" />
              </div>
            </h2>
            {timestamp && <p>{new Date(timestamp).getFullYear()}</p>}
            <p className="line-clamp-1">
              {item.cast
                .slice(0, 2)
                .map(({ name }) => name)
                .join(", ")}
            </p>
          </div>
        </div>
        <CornerDownLeft className="h-6 w-5 flex-none text-gray-400 transition-opacity aria-selected:opacity-100 aria-unselected:opacity-0" />
      </a>
    </div>
  );
}

type ActorItemProps = {
  item: ActorItem;
};

function ActorOrDirectorItem({ item }: ActorItemProps) {
  const [name, image] = item.label.split("||");

  return (
    <div className="flex cursor-default select-none items-center justify-between space-x-4 rounded-md p-3 text-sm aria-selected:bg-gray-800/80 aria-selected:text-white">
      <div className="flex items-center space-x-4">
        <div className="relative h-12 w-12 flex-none overflow-hidden rounded-full">
          <ImageWithLoader
            src={`${TMDB_IMAGE_BASE_URL}original${image}`}
            alt={name}
            className="absolute inline-block object-cover"
            fallback={({ isLoading }) => (
              <div
                className={cx(
                  "absolute inset-0 bg-gray-700 transition-opacity",
                  isLoading ? "animate-pulse opacity-100" : "opacity-0"
                )}
              />
            )}
          />
        </div>
        <div className="flex flex-col justify-between">
          <h2 className="font-semibold text-white line-clamp-1">{name}</h2>
        </div>
      </div>
      <CornerDownLeft className="h-6 w-5 flex-none text-gray-400 transition-opacity aria-selected:opacity-100 aria-unselected:opacity-0" />
    </div>
  );
}

type MovieOrShowPreviewProps = {
  item: Hit<ShowItem | MovieItem>;
  components: AutocompleteComponents;
  type: string | undefined;
};

function MovieOrShowPreview({
  item,
  components,
  type,
}: MovieOrShowPreviewProps) {
  const timestamp = isMovie(item) ? item.release_date : item.first_air_date;

  return (
    <div className="hidden h-[36rem] w-1/2 flex-none flex-col overflow-y-auto md:flex">
      <div className="flex h-full flex-none flex-col justify-between p-4">
        <div>
          <h2 className="mb-2 text-2xl font-semibold text-white line-clamp-1">
            <div className="child-mark:bg-transparent child-mark:text-red-600 child-mark:underline child-mark:underline-offset-2">
              <components.Highlight hit={item} attribute="title" />
            </div>
          </h2>
          <div className="mb-1 flex flex-col justify-between lg:flex-row lg:items-center lg:space-x-3">
            <div className="mb-2 flex items-center space-x-2 text-xs text-gray-400 lg:mb-4">
              {type && <span>{type}</span>}
              <span className="inline-block h-4 w-px flex-none bg-white/20" />
              {timestamp && <span>{new Date(timestamp).getFullYear()}</span>}
            </div>
            <div className="mb-4 space-x-2">
              {item.genres?.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-100"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4 text-sm text-gray-400 line-clamp-2">
            <div className="child-mark:bg-transparent child-mark:text-red-600 child-mark:underline child-mark:underline-offset-2">
              <components.Snippet hit={item} attribute="overview" />
            </div>
          </div>
          <h3 className="mb-3 font-semibold text-white">Cast</h3>
          <div className="relative z-0 mb-4 flex flex-none flex-wrap space-x-2 overflow-hidden">
            {item.cast?.slice(0, 10).map((actor) => {
              if (!actor.profile_path) {
                return null;
              }

              return (
                <div
                  key={actor.name}
                  className="relative mb-2 h-8 w-8 flex-none overflow-hidden rounded-full"
                >
                  <ImageWithLoader
                    key={actor.name}
                    src={`${TMDB_IMAGE_BASE_URL}original${actor.profile_path}`}
                    alt={actor.name}
                    title={actor.name}
                    className="absolute inset-0 z-30 inline-block object-cover"
                    fallback={({ isLoading }) => (
                      <div
                        className={cx(
                          "absolute inset-0 bg-gray-700 transition-colors",
                          isLoading ? "animate-pulse opacity-100" : "opacity-0"
                        )}
                      />
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {item.videos.length > 0 ? (
          <YouTubeVideo id={item.videos[0].key} />
        ) : (
          <div className="relative flex aspect-video items-center overflow-hidden rounded">
            <ImageWithLoader
              src={`${TMDB_IMAGE_BASE_URL}original${item.backdrop_path}`}
              fallback={({ isLoading }) => (
                <div
                  className={cx(
                    "absolute inset-0 bg-gray-700 transition-colors",
                    isLoading ? "animate-pulse opacity-100" : "opacity-0"
                  )}
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

type HeadingProps = React.PropsWithChildren<{}>;

function Heading({ children }: HeadingProps) {
  return (
    <h2 className="flex items-center space-x-2 px-3 text-lg font-semibold text-gray-200">
      {children}
    </h2>
  );
}

function SourceHeading({ children }: HeadingProps) {
  return (
    <h3 className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">
      {children}
    </h3>
  );
}

function showToAlgoliaRecord(
  show: Show & {
    genres: Genre[];
    cast: Array<Credit & { person: Person }>;
    videos: Video[];
    seasons: Array<Season & { episodes: Episode[] }>;
  }
) {
  const firstAirDate = show.seasons[0].episodes[0].airDate;

  return {
    objectID: String(show.tmdbId),
    record_type: "show",
    backdrop_path: show.backdropPath,
    poster_path: show.posterPath,
    title: show.name,
    overview: show.overview,
    genres: show.genres.map(({ name }) => name),
    cast: show.cast.map((credit) => ({
      name: credit.person.name,
      profile_path: credit.person.profilePath,
    })),
    videos: show.videos.map(({ key }) => ({
      key,
    })),
    in_production: show.inProduction,
    first_air_date: new Date(firstAirDate).getTime(),
  };
}

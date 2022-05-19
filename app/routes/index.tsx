import { useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  useHits,
} from "react-instantsearch-hooks-web";
import { useLoaderData } from "@remix-run/react";

import {
  cx,
  isMovie,
  useOptionalFavoriteShowsWithNewSeasons,
  useOptionalUser,
} from "~/utils";
import { Main } from "~/layout/main";
import { searchClient } from "~/search-client";
import {
  ALGOLIA_FILTERS,
  ALGOLIA_INDEX_NAME,
  TMDB_IMAGE_BASE_URL,
} from "~/constants";

import type { Hit } from "instantsearch.js";
import type { ShowItem } from "~/types/ShowItem";
import type { MovieItem } from "~/types/MovieItem";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getServerState } from "react-instantsearch-hooks-server";
import { VirtualSearchBox } from "~/components/virtual-search-box";

export const loader: LoaderFunction = async () => {
  const serverState = await getServerState(<Hero />);

  return { serverState };
};

export default function Index() {
  const { serverState } = useLoaderData();
  const user = useOptionalUser();
  const favoriteShows = useOptionalFavoriteShowsWithNewSeasons();

  return (
    <Main user={user} searchFallbackData={{ favoriteShows }}>
      <InstantSearchSSRProvider {...serverState}>
        <Hero />
      </InstantSearchSSRProvider>
    </Main>
  );
}

function Hero() {
  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX_NAME}>
      <Configure hitsPerPage={20} filters={ALGOLIA_FILTERS} />
      <VirtualSearchBox />
      <Preview />
    </InstantSearch>
  );
}

function Preview() {
  const { hits } = useHits<Hit<ShowItem | MovieItem>>();
  const [selectedHit, setSelectedHit] = useState<Hit<
    ShowItem | MovieItem
  > | null>(null);

  useEffect(() => {
    setSelectedHit(hits[0]);
  }, [hits]);

  if (!selectedHit) {
    return null;
  }

  const releaseDate = isMovie(selectedHit)
    ? selectedHit.release_date
    : selectedHit.first_air_date;

  return (
    <main className="after:h-min-h-screen relative top-0 flex min-h-screen w-full flex-col bg-cover bg-center bg-no-repeat pt-20 before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:right-0 before:z-10 before:block before:h-96 before:w-screen before:bg-gradient-to-b before:from-transparent before:to-black before:content-[''] after:absolute after:inset-0 after:z-10 after:block after:h-full after:w-screen after:bg-black/50 after:content-['']">
      {hits.map((hit) => (
        <Transition
          key={hit.objectID}
          show={selectedHit.objectID === hit.objectID}
          className="w-full"
          enter="transition-opacity duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <img
            src={`${TMDB_IMAGE_BASE_URL}original${hit.backdrop_path}`}
            alt={hit.title}
            className="absolute inset-0 h-full w-full object-cover opacity-30 xl:opacity-60"
          />
        </Transition>
      ))}
      <div className="relative z-20 mx-auto w-full px-6 lg:container lg:px-8">
        <div className="flex flex-col justify-end">
          <div className="mt-20 flex aspect-video flex-col justify-center space-y-10 lg:space-y-12 xl:mt-0">
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-5xl font-bold leading-normal text-white line-clamp-1">
                  {selectedHit.title}
                </h2>
                <div className="flex space-x-2 text-sm text-white">
                  <p className="mb-6 flex items-center space-x-3 text-sm">
                    {releaseDate && (
                      <span>{new Date(releaseDate).getFullYear()}</span>
                    )}
                    {releaseDate && (
                      <span className="inline-block h-4 w-px flex-none bg-white/30" />
                    )}
                    <span className="line-clamp-1">
                      {selectedHit.genres.join(", ")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="h-28 xl:h-auto">
                <p className="text-lg text-white line-clamp-4 xl:w-2/3 xl:line-clamp-2">
                  {selectedHit.overview}
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="flex-none rounded-full bg-red-500 px-6 py-3 font-bold text-white shadow-lg shadow-red-500/50 transition-colors hover:bg-red-600 focus:bg-red-400">
                  Watch now
                </button>
                <button className="flex-none rounded-full bg-gray-600 px-6 py-3 font-bold text-white shadow-lg shadow-gray-600/50 transition-colors hover:bg-gray-700 focus:bg-gray-500">
                  More info
                </button>
              </div>
            </div>
            <div className="w-full">
              <h3 className="mb-2 text-2xl font-bold text-white">Popular</h3>
              <ul className="flex touch-pan-x list-none space-x-4 overflow-x-scroll">
                {hits.map((hit) => {
                  const isSelected = selectedHit.objectID === hit.objectID;

                  return (
                    <PreviewItem
                      key={hit.objectID}
                      item={hit}
                      isSelected={isSelected}
                      onClick={() => setSelectedHit(hit)}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

type PreviewItemProps = {
  item: Hit<ShowItem | MovieItem>;
  isSelected: boolean;
  onClick(): void;
};

function PreviewItem({ item, isSelected, onClick }: PreviewItemProps) {
  const ref = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (isSelected) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isSelected]);

  return (
    <li ref={ref}>
      <button
        onClick={onClick}
        className="group relative mb-5 space-y-2 pb-5"
        title={item.title}
      >
        <div className="rounded bg-black">
          <img
            className={cx(
              "h-auto w-40 max-w-none rounded transition-opacity group-hover:opacity-100",
              isSelected ? "opacity-100" : "opacity-60"
            )}
            src={`${TMDB_IMAGE_BASE_URL}w185${item.backdrop_path}`}
            alt={item.title}
          />
        </div>
        <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
        <div
          className={cx(
            "absolute bottom-0 h-1 w-full rounded-full bg-red-600 transition-transform",
            isSelected ? "scale-x-100" : "scale-x-0"
          )}
        />
      </button>
    </li>
  );
}

import { Main } from "~/layout/main";
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  RefinementList,
  useInfiniteHits,
} from "react-instantsearch-hooks-web";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { history } from "instantsearch.js/cjs/lib/routers/index.js";
import { getServerState } from "react-instantsearch-hooks-server";
import { HeartIcon, PlusIcon } from "@heroicons/react/outline";

import { ImageWithLoader } from "~/components/image-with-loader";
import {
  cx,
  getUrl,
  isShow,
  minutesToHours,
  useOptionalFavoriteShowsWithNewSeasons,
  useOptionalUser,
} from "~/utils";
import { searchClient } from "~/search-client";
import {
  ALGOLIA_FILTERS,
  ALGOLIA_INDEX_NAME,
  TMDB_IMAGE_BASE_URL,
} from "~/constants";
import { Play } from "~/components/icons/play";

import type { BaseHit, Hit, UiState } from "instantsearch.js";
import type { LoaderFunction } from "@remix-run/server-runtime";
import type { MovieItem } from "~/types/MovieItem";
import type { ShowItem } from "~/types/ShowItem";
import { VirtualSearchBox } from "~/components/virtual-search-box";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const serverState = await getServerState(<Search url={url} />);

  return { serverState, url };
};

export default function Page() {
  const { serverState, url } = useLoaderData();
  const user = useOptionalUser();
  const favoriteShows = useOptionalFavoriteShowsWithNewSeasons();

  return (
    <Main user={user} searchFallbackData={{ favoriteShows }}>
      <main className="relative top-0 flex min-h-screen w-full flex-col bg-cover bg-center pt-40 pb-10">
        <div className="container relative z-20 mx-auto px-2 text-white sm:px-6 lg:px-8">
          <InstantSearchSSRProvider {...serverState}>
            <Search url={url} />
          </InstantSearchSSRProvider>
        </div>
      </main>
    </Main>
  );
}

type SearchProps = {
  url: URL;
};

function Search({ url }: SearchProps) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={ALGOLIA_INDEX_NAME}
      routing={{
        router: history({
          getLocation: () => {
            return typeof window === "undefined"
              ? new URL(url)
              : window.location;
          },
        }),
        stateMapping: {
          stateToRoute(uiState) {
            const indexUiState = uiState[ALGOLIA_INDEX_NAME] || {};

            return {
              q: indexUiState.query,
              genres: indexUiState.refinementList?.genres,
            } as UiState;
          },
          routeToState(routeState) {
            return {
              [ALGOLIA_INDEX_NAME]: {
                query: routeState.q,
                refinementList: {
                  genres: routeState.genres,
                },
              } as UiState,
            };
          },
        },
      }}
    >
      <Configure hitsPerPage={30} filters={ALGOLIA_FILTERS} />
      <VirtualSearchBox />
      <div className="mb-5 flex touch-pan-x space-x-3 overflow-x-scroll">
        <span className="relative -top-px mt-2.5 text-gray-500">Genres</span>
        <RefinementList
          attribute="genres"
          operator="and"
          classNames={{
            list: "flex space-x-2",
            item: "my-1",
            label:
              "block rounded-full bg-gray-800 hover:bg-gray-700 transitions-colors px-4 py-1.5 font-medium text-gray-100 cursor-pointer selected:bg-red-600",
            selectedItem: "selected",
            count: "hidden",
            checkbox: "hidden",
          }}
        />
      </div>
      <InfiniteHitsScroll hitComponent={ShowOrMovieHit} />
    </InstantSearch>
  );
}

type HitProps = {
  hit: Hit<MovieItem> | Hit<ShowItem>;
};

function ShowOrMovieHit({ hit }: HitProps) {
  const url = getUrl(hit);

  return (
    <>
      <Link to={url}>
        <ImageWithLoader
          src={`${TMDB_IMAGE_BASE_URL}w342${hit.poster_path}`}
          className="absolute inset-0 h-full overflow-hidden"
          fallback={({ isLoading }) => (
            <div
              className={cx(
                "absolute inset-0 bg-gray-700 px-4 py-3.5 transition-colors",
                isLoading ? "animate-pulse opacity-100" : "opacity-0"
              )}
            >
              {hit.title}
            </div>
          )}
        />
      </Link>
      <div className="absolute bottom-0 left-0 right-0 scale-0 bg-gray-800 p-4 opacity-0 transition-opacity group-item-hover:scale-100 group-item-hover:opacity-100 group-item-hover:delay-500">
        <ul className="mb-2 flex space-x-1">
          <li>
            <Link
              to={url}
              title={`Play this ${hit.record_type}`}
              className="group block flex-none rounded-full border-2 border-white/40 bg-gray-700 p-1.5 transition-colors hover:border-white/100"
            >
              <Play className="relative left-px h-3 w-3 fill-white/0 stroke-white transition-colors group-hover:fill-white/100" />
            </Link>
          </li>
          <li>
            <button
              title="Add to my list"
              className="group flex-none rounded-full border-2 border-white/40 bg-gray-700 p-1.5 transition-colors hover:border-white/100"
            >
              <PlusIcon className="h-3 w-3 fill-white/0 stroke-white transition-colors group-hover:fill-white/100" />
            </button>
          </li>
          <li>
            <button
              title="I liked this"
              className="group flex-none rounded-full border-2 border-white/40 bg-gray-700 p-1.5 transition-colors hover:border-white/100"
            >
              <HeartIcon className="h-3 w-3 fill-white/0 stroke-white transition-colors group-hover:fill-white/100" />
            </button>
          </li>
        </ul>
        <h2 className="mb-1 truncate text-sm font-semibold">{hit.title}</h2>
        <p className="mb-1 text-xs text-gray-400">
          {isShow(hit)
            ? `${hit.seasons.length} season${hit.seasons.length > 1 ? "s" : ""}`
            : minutesToHours(hit.runtime)}
        </p>
        <ul className="flex space-x-1 truncate text-xs font-medium text-gray-100">
          {hit.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="after:ml-1 after:text-gray-600 after:content-['•'] last:after:content-none"
            >
              {genre}
            </span>
          ))}
        </ul>
      </div>
    </>
  );
}

type InfiniteHitsScrollProps<THit extends BaseHit = BaseHit> = {
  hitComponent: React.JSXElementConstructor<{
    hit: THit;
  }>;
};

function InfiniteHitsScroll<THit extends BaseHit = BaseHit>({
  hitComponent: HitComponent,
}: InfiniteHitsScrollProps<THit>) {
  const { hits, showMore, isLastPage } = useInfiniteHits();
  const { ref: sentinelRef, inView } = useInView();

  useEffect(() => {
    if (inView && !isLastPage) {
      showMore();
    }
  }, [inView, showMore, isLastPage]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {hits.map((hit) => (
          <li
            key={hit.objectID}
            className="group-item relative aspect-[2/3] cursor-pointer overflow-hidden rounded bg-gray-800 shadow-2xl transition-transform hover:z-20 hover:scale-125 hover:delay-500"
          >
            <HitComponent hit={hit as THit} />
          </li>
        ))}
      </ul>
      {!isLastPage && (
        <div ref={sentinelRef} className="p-4 text-center text-gray-600">
          Loading more hits...
        </div>
      )}
    </>
  );
}

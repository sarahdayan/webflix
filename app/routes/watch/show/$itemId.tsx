import { Transition } from "@headlessui/react";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { ImageWithLoader } from "~/components/image-with-loader";

import { TMDB_IMAGE_BASE_URL } from "~/constants";
import { cx } from "~/utils";
import { Spinner } from "~/components/icons/spinner";
import { getShowByTmdbId } from "~/models/show.server";

import type { LoaderFunction } from "@remix-run/node";
import type { Show } from "~/models/show.server";

type LoaderData = {
  show: Show;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.itemId, "You must provide an `itemId`");

  const show = await getShowByTmdbId(Number(params.itemId));

  if (!show) {
    throw new Response("Not found", { status: 404 });
  }

  return { show };
};

export default function Page() {
  const { show } = useLoaderData<LoaderData>();

  return (
    <Transition
      appear={true}
      show={true}
      enter="duration-500"
      enterFrom="scale-0 opacity-0"
      enterTo="scale-100 opacity-100"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-0 opacity-0"
      className="relative flex items-center justify-center w-screen h-screen text-white transition-all origin-center"
    >
      <ImageWithLoader
        src={`${TMDB_IMAGE_BASE_URL}original${show.backdropPath}`}
        className="absolute inset-0 object-cover w-full h-full"
        fallback={({ isLoading }) => (
          <div
            className={cx(
              "absolute inset-0 bg-gray-700 px-4 py-3.5 transition-colors",
              isLoading ? "animate-pulse opacity-100" : "opacity-0"
            )}
          >
            {show.name}
          </div>
        )}
      />
      <div className="absolute flex-none w-12 h-12 text-red-600 -translate-y-1/2 -t6anslate-x-1/2 top-1/2 left-1/2">
        <Spinner className="animate-spin" aria-hidden="true" />
      </div>
    </Transition>
  );
}

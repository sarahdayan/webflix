import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import type { ReturnedGetFavoriteShows } from "~/models/show.server";
import { getFavoriteShows } from "~/models/show.server";

import type { User } from "@prisma/client";
import type { ReturnedGetUser } from "~/session.server";

import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Webflix",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: ReturnedGetUser;
  favoriteShowsWithNewSeasons?: ReturnedGetFavoriteShows;
};

export const loader: LoaderFunction = async ({ request }) => {
  const today = new Date();

  const user = await getUser(request);

  if (user) {
    const favoriteShows = await getFavoriteShows(user as User);
    const favoriteShowsWithNewSeasons = favoriteShows.filter((show) => {
      return show.seasons.find((season) => {
        const viewed = season.episodes.find((episode) =>
          episode.viewedBy.includes(user as User)
        );
        const airDate = new Date(season.episodes[0].airDate);

        return airDate.getFullYear() >= today.getFullYear() && !viewed;
      });
    });

    return json<LoaderData>({ user, favoriteShowsWithNewSeasons });
  }

  return json<LoaderData>({ user });
};

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full overflow-x-hidden bg-gray-900">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

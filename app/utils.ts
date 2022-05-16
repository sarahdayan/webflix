import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { ReturnedGetUser } from "~/session.server";
import type { ReturnedGetFavoriteShows } from "~/models/show.server";
import type { ShowItem } from "~/types/ShowItem";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );

  return route?.data;
}

function isUser(user: any): user is ReturnedGetUser {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): ReturnedGetUser | undefined {
  const data = useMatchesData("root");

  if (!data || !isUser(data.user)) {
    return undefined;
  }

  return data.user;
}

export function useUser(): ReturnedGetUser {
  const maybeUser = useOptionalUser();

  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by `useUser`. If user is optional, try `useOptionalUser` instead."
    );
  }

  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function useOptionalFavoriteShowsWithNewSeasons():
  | ReturnedGetFavoriteShows
  | undefined {
  const data = useMatchesData("root");

  if (!data?.favoriteShowsWithNewSeasons) {
    return undefined;
  }

  return data.favoriteShowsWithNewSeasons as ReturnedGetFavoriteShows;
}

export function cx(
  ...classNames: Array<string | number | boolean | undefined | null>
) {
  return classNames.filter(Boolean).join(" ");
}

export function isShow(item: Record<string, unknown>): item is ShowItem {
  return item?.record_type === "show";
}

export function minutesToHours(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const minutesRemaining = minutes % 60;

  if (minutesRemaining === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutesRemaining} min`;
}

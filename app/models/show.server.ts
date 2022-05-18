import type { Show, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Show } from "@prisma/client";

export async function getShowByTmdbId(tmdbId: Show["tmdbId"]) {
  return prisma.show.findUnique({ where: { tmdbId } });
}

export type ReturnedGetFavoriteShows = Awaited<
  ReturnType<typeof getFavoriteShows>
>;

// @todo: pre-process as much as possible on the database
export async function getFavoriteShows(user: User) {
  const shows = await prisma.show
    .findMany({
      where: {
        seasons: {
          some: {
            episodes: {
              some: {
                viewedBy: {
                  some: {
                    id: user.id,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        seasons: {
          include: {
            episodes: {
              include: {
                viewedBy: true,
              },
            },
          },
        },
      },
    })
    .then((shows) => {
      return shows.sort((a, b) => {
        const { viewedA, totalA } = a.seasons.reduce(
          (acc, season) => {
            const viewed = season.episodes.filter(({ viewedBy }) =>
              viewedBy.includes(user)
            );

            return {
              viewedA: acc.viewedA + viewed.length,
              totalA: acc.totalA + season.episodes.length,
            };
          },
          { viewedA: 0, totalA: 0 }
        );
        const { viewedB, totalB } = b.seasons.reduce(
          (acc, season) => {
            const viewed = season.episodes.filter(({ viewedBy }) =>
              viewedBy.includes(user)
            );

            return {
              viewedB: acc.viewedB + viewed.length,
              totalB: acc.totalB + season.episodes.length,
            };
          },
          { viewedB: 0, totalB: 0 }
        );

        return (viewedB * 100) / totalB - (viewedA * 100) / totalA;
      });
    });

  return shows;
}

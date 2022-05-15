import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import shows from "./fixtures/shows.json";

const prisma = new PrismaClient();

async function seed() {
  const email = "sarah@algolia.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("remixiscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  // Create all `Show`s
  // @todo: replace with `createMany` once Prisma supports it for SQLite
  // https://github.com/prisma/prisma/issues/10710
  await Promise.all(
    shows.map((show) =>
      prisma.show.create({
        data: {
          tmdbId: show.id,
          backdropPath: show.backdrop_path,
          homepage: show.homepage,
          inProduction: show.in_production,
          name: show.name,
          originalLanguage: show.original_language,
          originalName: show.original_name,
          overview: show.overview,
          popularity: show.popularity,
          posterPath: show.poster_path,
          status: show.status,
          tagline: show.tagline,
          type: show.type,
          voteAverage: show.vote_average,
          voteCount: show.vote_count,
          cast: {
            connectOrCreate: show.cast
              .map((credit) => {
                if (!credit.person.id) {
                  return null;
                }

                return {
                  where: { tmdbId: credit.id },
                  create: {
                    tmdbId: credit.id,
                    job: credit.job,
                    person: {
                      connectOrCreate: {
                        where: { tmdbId: credit.person.id },
                        create: {
                          tmdbId: credit.person.id,
                          imdbId: credit.person.imdb_id,
                          activity: credit.person.activity,
                          name: credit.person.name,
                          adult: credit.person.adult,
                          biography: credit.person.biography,
                          birthday:
                            credit.person.birthday &&
                            new Date(credit.person.birthday),
                          deathday:
                            credit.person.deathday &&
                            new Date(credit.person.deathday),
                          gender: credit.person.gender,
                          homepage: credit.person.homepage,
                          placeOfBirth: credit.person.place_of_birth,
                          popularity: credit.person.popularity,
                          profilePath: credit.person.profile_path,
                        },
                      },
                    },
                  },
                };
              })
              .filter(isNonNullable),
          },
          seasons: {
            create: show.seasons.map((season) => ({
              tmdbId: season.id,
              overview: season.overview,
              posterPath: season.poster_path,
              seasonNumber: season.season_number,
              episodes: {
                create: season.episodes.map((episode) => ({
                  tmdbId: episode.id,
                  airDate: new Date(episode.air_date),
                  number: episode.episode_number,
                  name: episode.name,
                  overview: episode.overview,
                  productionCode: episode.production_code,
                  stillPath: episode.still_path,
                  voteAverage: episode.vote_average,
                  voteCount: episode.vote_count,
                  crew: {
                    connectOrCreate: episode.crew
                      .map((credit) => {
                        if (!credit.person.id) {
                          return null;
                        }

                        return {
                          where: { tmdbId: credit.id },
                          create: {
                            tmdbId: credit.id,
                            job: credit.job,
                            person: {
                              connectOrCreate: {
                                where: { tmdbId: credit.person.id },
                                create: {
                                  tmdbId: credit.person.id,
                                  imdbId: credit.person.imdb_id,
                                  activity: credit.person.activity,
                                  name: credit.person.name,
                                  adult: credit.person.adult,
                                  biography: credit.person.biography,
                                  birthday:
                                    credit.person.birthday &&
                                    new Date(credit.person.birthday),
                                  deathday:
                                    credit.person.deathday &&
                                    new Date(credit.person.deathday),
                                  profilePath: credit.person.profile_path,
                                  popularity: credit.person.popularity,
                                  gender: credit.person.gender,
                                },
                              },
                            },
                          },
                        };
                      })
                      .filter(isNonNullable),
                  },
                })),
              },
            })),
          },
          creators: {
            connectOrCreate: show.creators
              .map((credit) => ({
                where: { tmdbId: credit.id },
                create: {
                  tmdbId: credit.id,
                  job: credit.job,
                  person: {
                    connectOrCreate: {
                      where: { tmdbId: credit.person.id },
                      create: {
                        tmdbId: credit.person.id,
                        imdbId: credit.person.imdb_id,
                        activity: credit.person.activity,
                        name: credit.person.name,
                        adult: credit.person.adult,
                        biography: credit.person.biography,
                        birthday:
                          credit.person.birthday &&
                          new Date(credit.person.birthday),
                        deathday:
                          credit.person.deathday &&
                          new Date(credit.person.deathday),
                        gender: credit.person.gender,
                        homepage: credit.person.homepage,
                        placeOfBirth: credit.person.place_of_birth,
                        popularity: credit.person.popularity,
                        profilePath: credit.person.profile_path,
                      },
                    },
                  },
                },
              }))
              .filter(isNonNullable),
          },
          genres: {
            connectOrCreate: show.genres.map((genre) => ({
              where: { tmdbId: genre.id },
              create: {
                tmdbId: genre.id,
                name: genre.name,
              },
            })),
          },
          networks: {
            connectOrCreate: show.networks.map((network) => ({
              where: { tmdbId: network.id },
              create: {
                tmdbId: network.id,
                name: network.name,
                logoPath: network.logo_path,
              },
            })),
          },
          producers: {
            connectOrCreate: show.producers.map((producer) => ({
              where: { tmdbId: producer.id },
              create: {
                tmdbId: producer.id,
                logoPath: producer.logo_path,
                name: producer.name,
                originCountry: producer.origin_country,
              },
            })),
          },
          productionCountries: {
            connectOrCreate: show.production_countries.map((country) => ({
              where: { iso31661: country.iso_3166_1 },
              create: {
                iso31661: country.iso_3166_1,
                name: country.name,
              },
            })),
          },
          spokenLanguages: {
            connectOrCreate: show.spoken_languages.map((language) => ({
              where: { iso6391: language.iso_639_1 },
              create: {
                iso6391: language.iso_639_1,
                name: language.name,
              },
            })),
          },
          videos: {
            create: show.videos.map((video) => ({
              iso31661: video.iso_3166_1,
              iso6391: video.iso_639_1,
              key: video.key,
              name: video.name,
              provider: video.site,
              size: video.size,
              type: video.type,
              official: video.official,
              publishedAt: new Date(video.published_at),
            })),
          },
        },
      })
    )
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function isNonNullable<TValue>(value: TValue): value is NonNullable<TValue> {
  return value !== null;
}

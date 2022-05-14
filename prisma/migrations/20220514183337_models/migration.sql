-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" INTEGER NOT NULL,
    "imdbId" TEXT,
    "adult" BOOLEAN NOT NULL,
    "backdropPath" TEXT,
    "budget" INTEGER NOT NULL,
    "homepage" TEXT,
    "originalLanguage" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "overview" TEXT,
    "popularity" REAL NOT NULL,
    "posterPath" TEXT,
    "releaseDate" DATETIME NOT NULL,
    "revenue" INTEGER NOT NULL,
    "runtime" INTEGER,
    "status" TEXT NOT NULL,
    "tagline" TEXT,
    "title" TEXT NOT NULL,
    "voteAverage" REAL NOT NULL,
    "voteCount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Show" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" INTEGER NOT NULL,
    "backdropPath" TEXT,
    "homepage" TEXT NOT NULL,
    "inProduction" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "originalLanguage" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "popularity" REAL NOT NULL,
    "posterPath" TEXT,
    "status" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "voteAverage" REAL NOT NULL,
    "voteCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" INTEGER NOT NULL,
    "overview" TEXT,
    "posterPath" TEXT,
    "seasonNumber" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "showId" TEXT,
    CONSTRAINT "Season_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" INTEGER NOT NULL,
    "airDate" DATETIME NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT,
    "productionCode" TEXT,
    "runtime" REAL,
    "stillPath" TEXT,
    "voteAverage" REAL NOT NULL,
    "voteCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "seasonId" TEXT,
    CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" INTEGER NOT NULL,
    "description" TEXT,
    "headquarters" TEXT,
    "homepage" TEXT,
    "logoPath" TEXT,
    "name" TEXT NOT NULL,
    "originCountry" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iso31661" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iso6391" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" INTEGER NOT NULL,
    "imdbId" TEXT,
    "name" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "adult" BOOLEAN NOT NULL,
    "biography" TEXT,
    "birthday" DATETIME,
    "deathday" DATETIME,
    "gender" INTEGER NOT NULL,
    "homepage" TEXT,
    "placeOfBirth" TEXT,
    "popularity" REAL NOT NULL,
    "profilePath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" TEXT NOT NULL,
    "job" TEXT,
    "personId" TEXT,
    "type" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Credit_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iso6391" TEXT NOT NULL,
    "iso31661" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "official" BOOLEAN NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MovieToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MovieToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ShowToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ShowToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Show" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ShowToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GenreToMovie" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GenreToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GenreToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GenreToShow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GenreToShow_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GenreToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "Show" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CompanyToMovie" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CompanyToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompanyToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Networks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Networks_A_fkey" FOREIGN KEY ("A") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Networks_B_fkey" FOREIGN KEY ("B") REFERENCES "Show" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Producers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Producers_A_fkey" FOREIGN KEY ("A") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Producers_B_fkey" FOREIGN KEY ("B") REFERENCES "Show" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CountryToMovie" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CountryToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CountryToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CountryToShow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CountryToShow_A_fkey" FOREIGN KEY ("A") REFERENCES "Country" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CountryToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "Show" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LanguageToMovie" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LanguageToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "Language" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LanguageToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LanguageToShow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LanguageToShow_A_fkey" FOREIGN KEY ("A") REFERENCES "Language" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LanguageToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "Show" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Creators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Creators_A_fkey" FOREIGN KEY ("A") REFERENCES "Credit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Creators_B_fkey" FOREIGN KEY ("B") REFERENCES "Show" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Cast" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Cast_A_fkey" FOREIGN KEY ("A") REFERENCES "Credit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Cast_B_fkey" FOREIGN KEY ("B") REFERENCES "Show" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Crew" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Crew_A_fkey" FOREIGN KEY ("A") REFERENCES "Credit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Crew_B_fkey" FOREIGN KEY ("B") REFERENCES "Episode" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "Movie"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Season_tmdbId_key" ON "Season"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_tmdbId_key" ON "Episode"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_tmdbId_key" ON "Genre"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_tmdbId_key" ON "Company"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Country_iso31661_key" ON "Country"("iso31661");

-- CreateIndex
CREATE UNIQUE INDEX "Language_iso6391_key" ON "Language"("iso6391");

-- CreateIndex
CREATE UNIQUE INDEX "Person_tmdbId_key" ON "Person"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Credit_tmdbId_key" ON "Credit"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieToVideo_AB_unique" ON "_MovieToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieToVideo_B_index" ON "_MovieToVideo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ShowToVideo_AB_unique" ON "_ShowToVideo"("A", "B");

-- CreateIndex
CREATE INDEX "_ShowToVideo_B_index" ON "_ShowToVideo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToMovie_AB_unique" ON "_GenreToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToMovie_B_index" ON "_GenreToMovie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToShow_AB_unique" ON "_GenreToShow"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToShow_B_index" ON "_GenreToShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToMovie_AB_unique" ON "_CompanyToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToMovie_B_index" ON "_CompanyToMovie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Networks_AB_unique" ON "_Networks"("A", "B");

-- CreateIndex
CREATE INDEX "_Networks_B_index" ON "_Networks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Producers_AB_unique" ON "_Producers"("A", "B");

-- CreateIndex
CREATE INDEX "_Producers_B_index" ON "_Producers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CountryToMovie_AB_unique" ON "_CountryToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_CountryToMovie_B_index" ON "_CountryToMovie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CountryToShow_AB_unique" ON "_CountryToShow"("A", "B");

-- CreateIndex
CREATE INDEX "_CountryToShow_B_index" ON "_CountryToShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageToMovie_AB_unique" ON "_LanguageToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageToMovie_B_index" ON "_LanguageToMovie"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageToShow_AB_unique" ON "_LanguageToShow"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageToShow_B_index" ON "_LanguageToShow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Creators_AB_unique" ON "_Creators"("A", "B");

-- CreateIndex
CREATE INDEX "_Creators_B_index" ON "_Creators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Cast_AB_unique" ON "_Cast"("A", "B");

-- CreateIndex
CREATE INDEX "_Cast_B_index" ON "_Cast"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Crew_AB_unique" ON "_Crew"("A", "B");

-- CreateIndex
CREATE INDEX "_Crew_B_index" ON "_Crew"("B");

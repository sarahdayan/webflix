import {
  useOptionalFavoriteShowsWithNewSeasons,
  useOptionalUser,
} from "~/utils";
import { Main } from "~/layout/main";

export default function Index() {
  const user = useOptionalUser();
  const favoriteShows = useOptionalFavoriteShowsWithNewSeasons();

  return (
    <Main user={user} searchFallbackData={{ favoriteShows }}>
      <main
        className="relative top-0 flex min-h-screen w-full flex-col bg-cover bg-center pt-20 after:absolute after:inset-0 after:z-10 after:block after:h-screen after:w-screen after:bg-gray-900/50 after:content-['']"
        style={{
          backgroundImage:
            "url(https://image.tmdb.org/t/p/original/5VKxIBSMVZxIKqJVPNThAnjgcOS.jpg)",
        }}
      >
        {/* <div className="container relative z-20 px-2 mx-auto sm:px-6 lg:px-8">
          <div className="h-[calc(100vh - 20rem)] flex flex-col justify-end">
            <div className="grid items-center gap-20 bg-green-300 aspect-video xl:grid-cols-2 xl:grid-rows-1">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2 text-5xl font-bold text-white">
                    Orange is the New Black
                  </h2>
                  <div className="flex space-x-2 text-sm text-white">
                    <span className="text-white/50">Genres:</span>
                    <ul className="flex space-x-1 list-none">
                      <li>Drama,</li>
                      <li>Comedy</li>
                    </ul>
                  </div>
                </div>
                <p className="text-lg text-white">
                  Évincé après un accident, Mickey Haller, avocat à Los Angeles,
                  installe son bureau sur la banquette arrière de sa Lincoln et
                  accepte de traiter une affaire de meurtre.
                </p>
                <button className="px-6 py-3 font-bold text-white transition-colors bg-red-500 rounded-full shadow-lg shadow-red-500/50 hover:bg-red-600 focus:bg-red-400">
                  Watch now
                </button>
              </div>
              <div className="xl:mt-40">
                <h3 className="mb-2 text-2xl font-bold text-white">Popular</h3>
                <ul className="flex space-x-4 list-none">
                  <li>
                    <button className="space-y-2 transition-opacity opacity-80 hover:opacity-100">
                      <img
                        className="w-40 h-auto rounded max-w-none"
                        src="https://image.tmdb.org/t/p/w185/9gm3lL8JMTTmc3W4BmNMCuRLdL8.jpg"
                        alt="Guardians of the Galaxy"
                      />
                      <h4 className="font-bold text-white">
                        Guardians of the Galaxy
                      </h4>
                    </button>
                  </li>
                  <li>
                    <button className="space-y-2 transition-opacity opacity-80 hover:opacity-100">
                      <img
                        className="w-40 h-auto rounded max-w-none"
                        src="https://image.tmdb.org/t/p/w185/9gm3lL8JMTTmc3W4BmNMCuRLdL8.jpg"
                        alt="Guardians of the Galaxy"
                      />
                      <h4 className="font-bold text-white">
                        Guardians of the Galaxy
                      </h4>
                    </button>
                  </li>
                  <li>
                    <button className="space-y-2 transition-opacity opacity-80 hover:opacity-100">
                      <img
                        className="w-40 h-auto rounded max-w-none"
                        src="https://image.tmdb.org/t/p/w185/9gm3lL8JMTTmc3W4BmNMCuRLdL8.jpg"
                        alt="Guardians of the Galaxy"
                      />
                      <h4 className="font-bold text-white">
                        Guardians of the Galaxy
                      </h4>
                    </button>
                  </li>
                  <li>
                    <button className="space-y-2 transition-opacity opacity-80 hover:opacity-100">
                      <img
                        className="w-40 h-auto rounded max-w-none"
                        src="https://image.tmdb.org/t/p/w185/9gm3lL8JMTTmc3W4BmNMCuRLdL8.jpg"
                        alt="Guardians of the Galaxy"
                      />
                      <h4 className="font-bold text-white">
                        Guardians of the Galaxy
                      </h4>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
      </main>
    </Main>
  );
}

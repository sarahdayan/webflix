import algoliasearch from "algoliasearch/lite";

import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } from "~/constants";

export const searchClient = algoliasearch(
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_API_KEY
);

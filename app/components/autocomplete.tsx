import { autocomplete } from "@algolia/autocomplete-js";
import { SearchIcon } from "@heroicons/react/outline";
import { createElement, Fragment, useEffect, useRef, useState } from "react";
import { render } from "react-dom";

import { useHotkeys } from "~/hooks/useHotkeys";
import { cx } from "~/utils";

import type { BaseItem } from "@algolia/autocomplete-core";
import type {
  AutocompleteApi,
  AutocompleteOptions,
  AutocompleteState,
} from "@algolia/autocomplete-js";

export function Autocomplete<TItem extends BaseItem>(
  props: Partial<AutocompleteOptions<TItem>>
) {
  const containerRef = useRef(null);
  const searchRef = useRef<AutocompleteApi<TItem> | null>(null);
  const [state, setState] = useState<AutocompleteState<TItem>>({
    collections: [],
    completion: null,
    context: {},
    isOpen: false,
    query: "",
    activeItemId: null,
    status: "idle",
  });

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    searchRef.current = autocomplete({
      container: containerRef.current,
      renderer: {
        createElement,
        Fragment,
        // @ts-ignore
        render,
      },
      classNames: {
        detachedSearchButton: "hidden",
        detachedOverlay:
          "md:p-6 lg:p-10 z-30 fixed inset-0 transition-opacity bg-gray-700/75",
        detachedContainer:
          "z-30 flex flex-col w-full h-screen max-w-5xl mx-auto overflow-hidden transition-all transform bg-gray-900 divide-y divide-gray-500 shadow-2xl divide-opacity-20 md:h-auto md:rounded-xl",
        detachedFormContainer: "flex relative flex-none",
        detachedCancelButton: "hidden",
        form: "flex-1",
        input:
          "h-16 w-full border-0 bg-transparent px-14 pr-4 text-white placeholder-gray-500 focus:outline-none appearance-none",
        submitButton:
          "absolute w-6 h-6 text-gray-500 pointer-events-none top-5 left-4",
        loadingIndicator:
          "absolute w-6 h-6 text-gray-500 pointer-events-none top-5 left-4 animate-spin",
        clearButton:
          "flex hidden:hidden items-center justify-center absolute top-0 right-0 h-full w-16 group text-gray-500 transition-colors hover:text-gray-300",
        panel:
          "flex-1 flex flex-col divide-y divide-gray-500 divide-opacity-20",
      },
      ...props,
      onStateChange(params) {
        props.onStateChange?.(params);
        setState(params.state);
      },
    });

    return () => {
      searchRef.current?.destroy();
    };
  }, [props]);

  useHotkeys(
    "cmd+k, ctrl+k",
    (event) => {
      event.preventDefault();

      searchRef.current?.setIsOpen(!state.isOpen);
    },
    [state.isOpen]
  );

  return (
    <>
      <SearchButton
        onClick={() => searchRef.current?.setIsOpen(true)}
        query={props.initialState?.query}
      />

      <div className="fixed inset-0 z-20 overflow-y-auto pointer-events-none md:p-6 lg:p-10">
        <div className="flex items-end justify-center sm:block sm:p-0">
          <div ref={containerRef} />
        </div>
      </div>
    </>
  );
}

type SearchButtonProps = {
  onClick(): void;
  query?: string;
};

function SearchButton({ onClick, query }: SearchButtonProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={onClick}
        className="p-1 rounded-full text-white/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 md:hidden"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-6 h-6" aria-hidden="true" />
      </button>
      {/*
        If the page takes a while to hydrate (e.g., slow connections) we display
        an HTML form so the search is still usable without JavaScript.
      */}
      {isMounted ? (
        <button onClick={onClick} className="relative hidden group md:block">
          <SearchIcon
            className="pointer-events-none absolute top-2.5 left-4 h-5 w-5 text-white/60 transition-colors group-hover:text-white"
            aria-hidden="true"
          />
          <span
            className={cx(
              "flex h-10 w-64 items-center rounded-sm border-0 bg-transparent pr-4 pl-11 transition-colors sm:text-sm",
              query ? "text-white" : "text-white/60 group-hover:text-white"
            )}
          >
            {query || "Search..."}
          </span>
        </button>
      ) : (
        <form className="relative hidden md:block">
          <SearchIcon
            className="pointer-events-none absolute top-2.5 left-4 h-5 w-5 text-white/60"
            aria-hidden="true"
          />
          <input
            className="w-full h-10 pr-4 text-white bg-transparent border-0 rounded-sm pl-11 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 sm:text-sm"
            placeholder="Search..."
            type="text"
            defaultValue={query}
          />
        </form>
      )}
    </>
  );
}

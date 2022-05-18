import React, { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, SearchIcon, XIcon } from "@heroicons/react/outline";
import { Link } from "@remix-run/react";
import gravatar from "gravatar";

import { cx } from "~/utils";
import { WebflixLogo } from "~/components/logos/webflix";
import type { ReturnedGetUser } from "~/session.server";

type MainProps = {
  children?: React.ReactNode;
  user?: ReturnedGetUser;
};

const navigation = [
  { name: "Discover", href: "/", current: true },
  { name: "Browse", href: "/", current: false },
  { name: "Watchlist", href: "/", current: false },
];

export function Main({ children, user }: MainProps) {
  return (
    <div className="relative bg-gray-900">
      <header className="fixed top-0 z-30 w-full">
        <div>
          <Disclosure
            as="nav"
            className="bg-gradient-to-b from-gray-900 to-transparent"
          >
            {({ open }) => (
              <>
                <div className="container px-2 mx-auto sm:px-6 lg:px-8">
                  <div className="relative flex items-center justify-between h-20">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                      {/* Mobile menu button*/}
                      <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white/50 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block w-6 h-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block w-6 h-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                      <Link
                        to={{ pathname: "/" }}
                        className="flex items-center flex-shrink-0"
                      >
                        <WebflixLogo className="h-6 text-red-600" />
                      </Link>
                      <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              to={{ pathname: item.href }}
                              className={cx(
                                item.current
                                  ? "font-medium text-white"
                                  : "text-white/50 hover:text-white",
                                "px-3 py-2 text-sm transition-colors"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                      <button
                        type="button"
                        className="p-1 rounded-full text-white/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 md:hidden"
                      >
                        <span className="sr-only">Search</span>
                        <SearchIcon className="w-6 h-6" aria-hidden="true" />
                      </button>

                      <form className="relative hidden md:block">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-white/60"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <input
                          className="w-full h-12 pr-4 text-white bg-transparent border-0 rounded-sm pl-11 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 sm:text-sm"
                          placeholder="Search..."
                          type="text"
                        />
                      </form>

                      {/* Profile dropdown */}
                      {user ? (
                        <Menu as="div" className="relative flex-none ml-3">
                          <div>
                            <Menu.Button className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="flex-none w-8 h-8 rounded-full"
                                src={gravatar.url(user.email)}
                                alt={user.email}
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cx(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Your profile
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cx(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Settings
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <form action="/logout" method="post">
                                    <button
                                      type="submit"
                                      className={cx(
                                        active ? "bg-gray-100" : "",
                                        "block w-full px-4 py-2 text-left text-sm text-gray-700"
                                      )}
                                    >
                                      Sign out
                                    </button>
                                  </form>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      ) : (
                        <Link
                          to={{ pathname: "/login" }}
                          className="px-4 py-2 ml-3 text-white transition-colors bg-red-500 rounded whitespace-nowrap hover:bg-red-600 focus:bg-red-400"
                        >
                          Sign in
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="sm:hidden">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={cx(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </header>
      {children}
    </div>
  );
}

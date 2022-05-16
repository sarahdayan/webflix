import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, SearchIcon, XIcon } from "@heroicons/react/outline";
import { Link } from "@remix-run/react";
import gravatar from "gravatar";

import { cx, useOptionalUser } from "~/utils";
import { WebflixLogo } from "~/components/logos/webflix";

const navigation = [
  { name: "Discover", href: "/", current: true },
  { name: "Browse", href: "/", current: false },
  { name: "Upcoming", href: "/", current: false },
  { name: "Watchlist", href: "/", current: false },
];

export default function Index() {
  const user = useOptionalUser();

  return (
    <div className="relative bg-gray-900">
      <header className="fixed top-0 z-20 w-full">
        <div>
          <Disclosure
            as="nav"
            className="bg-gradient-to-b from-gray-900 to-transparent"
          >
            {({ open }) => (
              <>
                <div className="container mx-auto px-2 sm:px-6 lg:px-8">
                  <div className="relative flex h-20 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                      {/* Mobile menu button*/}
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white/50 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                      <div className="flex flex-shrink-0 items-center">
                        <WebflixLogo className="h-6 text-red-600" />
                      </div>
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
                        className="rounded-full p-1 text-white/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">Search</span>
                        <SearchIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      {user && (
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 flex-none rounded-full"
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
                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="/"
                                    className={cx(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Your Profile
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
                                  <a
                                    href="/"
                                    className={cx(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Sign out
                                  </a>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      )}
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="sm:hidden">
                  <div className="space-y-1 px-2 pt-2 pb-3">
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
    </div>
  );
}

import { Logo } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { SunIcon, MoonIcon, LanguageIcon } from "@heroicons/react/24/outline";

export default function ReaderNavbar() {
  return (
    <header className="relative flex h-20 items-center justify-between bg-primary px-10 text-white lg:fixed lg:right-0 lg:top-0 lg:z-30 lg:w-full lg:gap-8 lg:px-4 lg:pl-10 xl:grid xl:grid-cols-12">
      <div className="xl:col-span-2">
        <Link href="/">
          <Logo className="-mt-1 h-12 w-auto" />
        </Link>
      </div>

      <div className="min-w-0 flex-1 md:px-8 xl:col-span-8">
        <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
          <div className="w-full">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary sm:text-sm sm:leading-6"
                placeholder="Search"
                type="search"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center lg:hidden">
        {/* Mobile menu button */}
        <Button size="icon" variant="ghost" className="relative">
          <span className="absolute -inset-0.5" />
          <span className="sr-only">Open menu</span>
          {/* {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : ( */}
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
          {/* )} */}
        </Button>
      </div>

      <div className="hidden lg:flex lg:items-center lg:justify-end lg:gap-3 xl:col-span-2">
        <Button size="icon" variant="ghost">
          <SunIcon className="h-6 w-6" />
        </Button>

        <Button size="icon" variant="ghost">
          <LanguageIcon className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}

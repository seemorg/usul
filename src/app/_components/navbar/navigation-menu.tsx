import { Logo } from "@/components/Icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import React from "react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Texts",
    href: "/texts",
    description: "Explore the most popular texts",
  },
  {
    title: "Authors",
    href: "/authors",
    description: "Explore the most popular authors",
  },
  {
    title: "Regions",
    href: "/regions",
    description: "Explore the most popular regions",
  },
  {
    title: "Genres",
    href: "/genres",
    description: "Explore the most popular genres",
  },
];

const contributeComponents: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Add Text",
    href: "/contribute/add-text",
    description: "Add a new text to the library",
  },
  {
    title: "Report Mistake",
    href: "/contribute/report-mistake",
    description: "Report a mistake in a text",
  },
  // {
  //   title: "Develop",
  //   href: "/contribute/develop",
  //   description: "Contribute to the development of the platform",
  // },
  {
    title: "Feedback",
    href: "/contribute/feedback",
    description: "Send us your feedback",
  },
];

export default function HomepageNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
          {/* <NavigationMenuContent>
            <ul className="flex flex-col gap-3 p-4 md:w-[300px]">
             
            </ul>
          </NavigationMenuContent> */}
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3 min-h-[250px]">
                <NavigationMenuLink className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                  <EnvelopeIcon className="h-6 w-6" />

                  <div className="mb-2 mt-4 text-lg font-medium">
                    Get Notified
                  </div>
                  <p className="text-sm leading-tight text-muted-foreground">
                    Stay tuned for the upcoming tools, utilizing cutting-edge AI
                    technologies.
                  </p>
                </NavigationMenuLink>
              </li>

              <ListItem href="/search" title="Advanced Search">
                Search for texts, authors, regions, and genres
              </ListItem>

              <ListItem href="/search" title="Text Explorer">
                Lorem ipsum dolor sit amet consectetur.
              </ListItem>

              <ListItem href="/search" title="Author Explorer">
                Lorem ipsum dolor sit amet consectetur.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Contribute</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3 min-h-[250px]">
                <NavigationMenuLink asChild>
                  <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="https://digitalseem.org" target="_blank">
                    <Logo className="h-auto w-6" />

                    <div className="mb-2 mt-4 text-lg font-medium">
                      About Seemore
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Stay tuned for the upcoming tools, utilizing cutting-edge
                      AI technologies.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>

              {contributeComponents.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/about" className={navigationMenuTriggerStyle()}>
              About
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

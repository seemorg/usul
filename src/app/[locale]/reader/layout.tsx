import Container from "@/components/ui/container";
import ReaderSidebar from "./_components/sidebar";
import SidebarResizer from "./_components/sidebar/sidebar-resizer";
import { cookies } from "next/headers";

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const layout = cookieStore.get("react-resizable-panels:layout");
  const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  const defaultLayout = layout
    ? (JSON.parse(layout.value) as number[])
    : undefined;
  const defaultCollapsed = collapsed
    ? (JSON.parse(collapsed.value) as { collapsed: boolean })
    : undefined;

  return (
    <div>
      <main className="relative flex min-h-screen w-full">
        <SidebarResizer
          sidebar={<ReaderSidebar />}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed?.collapsed}
        >
          <Container className="w-full min-w-0 flex-auto py-10 pt-20 lg:pl-0 lg:pr-8 xl:px-16">
            <article>{children}</article>

            {/* <dl className="flex pt-6 mt-12 border-t border-slate-200">
                {previousPage && (
                  <div>
                    <dt className="text-sm font-medium font-display text-secondary">
                      Previous Chapter
                    </dt>
                    <dd className="mt-1">
                      <Link
                        href={previousPage.href}
                        className="text-base font-semibold text-slate-500 hover:text-slate-600"
                      >
                        <span aria-hidden="true">&larr;</span>{" "}
                        {previousPage.title}
                      </Link>
                    </dd>
                  </div>
                )}
                {nextPage && (
                  <div className="ml-auto text-right">
                    <dt className="text-sm font-medium font-display text-secondary">
                      Next Chapter
                    </dt>
                    <dd className="mt-1">
                      <Link
                        href={nextPage.href}
                        className="text-base font-semibold text-slate-500 hover:text-slate-600 "
                      >
                        {nextPage.title} <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </dd>
                  </div>
                )}
              </dl> */}
          </Container>
          {/* <Footer /> */}
        </SidebarResizer>
      </main>
    </div>
  );
}

import Container from "@/components/ui/container";
import ReaderSidebar from "./_components/sidebar";
import ReaderNavbar from "./_components/navbar";

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return (
  //   <div>
  //     <ReaderNavbar />

  //     <div className="mt-20 flex items-start gap-10">
  //       <main className="w-full flex-[2]">
  //         <Container>{children}</Container>
  //       </main>

  //       <ReaderSidebar />
  //     </div>
  //   </div>
  // );
  return (
    <div>
      <ReaderNavbar />

      <main className="relative flex min-h-screen w-full">
        <div className="relative w-full">
          <Container className="w-full">
            <div className="min-w-0 flex-auto px-4 py-10 lg:pl-0 lg:pr-8 xl:px-16">
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
            </div>
          </Container>
          {/* <Footer /> */}
        </div>

        <ReaderSidebar />
      </main>
    </div>
  );
}

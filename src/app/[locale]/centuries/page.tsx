import { Logo } from "@/components/Icons";
import Container from "@/components/ui/container";
import { getNumberWithOrdinal } from "@/lib/number";
import { navigation } from "@/lib/urls";
import { Link } from "@/navigation";
import { findAllYearRanges } from "@/server/services/years";

export default async function CenturiesPage() {
  const yearRanges = await findAllYearRanges();

  return (
    <div className="flex min-h-screen w-full bg-primary py-28 text-white">
      <Container className="flex flex-col items-center">
        <h1 className="flex flex-col items-center gap-10 font-abhaya text-7xl font-bold md:flex-row">
          <Logo className="h-28 w-auto" />
          <div className="hidden h-16 w-1 rounded-full bg-white md:block" />
          <span className="-mb-2">Locations</span>
        </h1>

        <div className="mt-20 grid grid-cols-2 gap-10">
          {yearRanges.map((range, idx) => (
            <Link
              prefetch={false}
              key={idx}
              href={navigation.centuries.byNumber(range.centuryNumber)}
            >
              <h2 className="text-xl font-semibold">
                {getNumberWithOrdinal(range.centuryNumber)} Century AH
              </h2>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}

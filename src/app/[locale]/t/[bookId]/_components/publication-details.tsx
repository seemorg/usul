import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const isNumber = (value: string | number) => {
  return !isNaN(Number(value));
};

const PublicationDetails = ({
  className,
  publicationDetails,
}: {
  className?: string;
  publicationDetails: PrismaJson.BookVersion["publicationDetails"];
}) => {
  const t = useTranslations();

  const items = useMemo(() => {
    if (!publicationDetails) return null;

    const final: { title: string; text: string | React.ReactNode }[] = [];
    if (publicationDetails.investigator)
      final.push({
        title: t("reader.publication-details.investigator"),
        text: publicationDetails.investigator,
      });

    if (publicationDetails.publisher)
      final.push({
        title: t("reader.publication-details.publisher"),
        text: publicationDetails.publisher,
      });

    if (publicationDetails.editionNumber)
      final.push({
        title: t("reader.publication-details.edition-number"),
        text: publicationDetails.editionNumber,
      });

    if (publicationDetails.publicationYear)
      final.push({
        title: t("reader.publication-details.publication-year"),
        text: isNumber(publicationDetails.publicationYear)
          ? t("common.year-format.ah.value", {
              year: publicationDetails.publicationYear,
            })
          : publicationDetails.publicationYear,
      });

    if (publicationDetails.publisherLocation)
      final.push({
        title: t("reader.publication-details.publisher-location"),
        text: publicationDetails.publisherLocation,
      });

    return final;
  }, [publicationDetails, t]);

  if (!items) return null;

  return (
    <div
      className={cn(
        "relative flex flex-wrap items-center gap-8 text-xs md:text-sm",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.title}>
          <p className="text-muted-foreground font-medium">{item.title}</p>
          <p className="mt-2 block font-semibold">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default PublicationDetails;

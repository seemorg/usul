import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

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

  return (
    <div
      className={cn(
        "relative flex flex-wrap items-center gap-6 text-sm",
        className,
      )}
    >
      {final.map((item, index, arr) => (
        <Fragment key={index}>
          <div>
            <p className="text-muted-foreground">{item.title}</p>
            <p className="mt-2 block">{item.text}</p>
          </div>

          {index < arr.length - 1 && (
            <Separator orientation="vertical" className="h-10" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default PublicationDetails;

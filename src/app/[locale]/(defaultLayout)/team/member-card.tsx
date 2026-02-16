import Image from "next/image";
import { Markdown } from "@/components/markdown";

export default function MemberCard({
  name,
  description,
  role,
  image,
  blurDataUrl,
}: {
  name: string;
  description: string;
  blurDataUrl?: string;
  role?: string;
  image?: string;
}) {
  return (
    <div className="group mx-auto max-w-72">
      {image ? (
        <div className="relative aspect-square w-full shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-200">
          <Image
            src={image}
            alt={`${name} image`}
            {...(blurDataUrl
              ? {
                placeholder: "blur",
                blurDataURL: blurDataUrl,
              }
              : {})}
            className="h-full w-full"
            fill
          />
        </div>
      ) : (
        <div className="bg-primary-foreground aspect-square w-full shrink-0 rounded-md" />
      )}

      <div className="mt-4">
        {role && (
          <p className="text-secondary-foreground mb-1 text-sm font-medium">
            {role}
          </p>
        )}
        <h3 className="text-xl font-medium">{name}</h3>
        <Markdown className="text-muted-foreground mt-2 text-sm hyphens-auto">{description}</Markdown>
      </div>
    </div>
  );
}

import Image from "next/image";

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
        <div className="relative aspect-square w-full flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-200">
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
        <div className="aspect-square w-full flex-shrink-0 rounded-md bg-primary-foreground" />
      )}
      {/* w-44 lg:w-56 */}

      <div className="mt-4">
        {role && (
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            {role}
          </p>
        )}
        <h3 className="text-xl font-medium">{name}</h3>
        <p className="mt-2 hyphens-auto text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

import _AITab from "./client";

export default async function AITab({
  params: { bookId },
}: {
  params: {
    bookId: string;
    versionId?: string;
  };
}) {
  return <_AITab bookSlug={bookId} />;
}

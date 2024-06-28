import _ContentTab from "./_components/content-tab";

export default async function ContentTab({
  params: { bookId, versionId },
}: {
  params: {
    bookId: string;
    versionId?: string;
  };
}) {
  return <_ContentTab bookId={bookId} versionId={versionId} />;
}

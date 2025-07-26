import CollectionBooks from "./collection-books";

async function ViewCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CollectionBooks slug={slug} />;
}

export default ViewCollectionPage;

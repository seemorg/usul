import Container from "@/components/ui/container";

import CollectionBooks from "./collection-books";

async function ViewCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Container className="mt-10">
      <CollectionBooks slug={slug} filters />
    </Container>
  );
}

export default ViewCollectionPage;

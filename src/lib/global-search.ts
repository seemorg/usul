import type { GlobalSearchDocument } from "@/types/global-search-document";
import { navigation } from "@/lib/urls";

export const getGlobalDocumentHref = (document: GlobalSearchDocument) => {
  if (document.type === "book") {
    return navigation.books.reader(document.slug);
  } else if (document.type === "author") {
    return navigation.authors.bySlug(document.slug);
  } else if (document.type === "genre") {
    return navigation.genres.bySlug(document.slug);
  } else if (document.type === "region") {
    return navigation.regions.bySlug(document.slug);
  }

  return null;
};

export const getGlobalDocumentLocalizedTypeKey = (
  type: GlobalSearchDocument["type"],
): keyof IntlMessages["entities"] | null => {
  if (type === "book") {
    return "text";
  } else if (type === "author") {
    return "author";
  } else if (type === "genre") {
    return "genre";
  } else if (type === "region") {
    return "region";
  }

  return null;
};

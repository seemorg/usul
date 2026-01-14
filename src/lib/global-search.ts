import type { GlobalSearchDocument } from "@/types/global-search-document";
import type { Messages } from "next-intl";
import { navigation } from "@/lib/urls";

export const getGlobalDocumentHref = (document: GlobalSearchDocument) => {
  if (document.type === "book") {
    return navigation.books.reader(document.slug);
  } else if (document.type === "author") {
    return navigation.authors.bySlug(document.slug);
  } else if (document.type === "advancedGenre") {
    return navigation.genres.bySlug(document.slug);
  } else if (document.type === "region") {
    return navigation.regions.bySlug(document.slug);
  } else if (document.type === "empire") {
    return navigation.empires.bySlug(document.slug);
  }

  return null;
};

export const getGlobalDocumentLocalizedTypeKey = (
  type: GlobalSearchDocument["type"],
): keyof Messages["entities"] | null => {
  if (type === "book") {
    return "text";
  } else if (type === "author") {
    return "author";
  } else if (type === "advancedGenre") {
    return "genre";
  } else if (type === "region") {
    return "region";
  } else if (type === "empire") {
    return "empire";
  }

  return null;
};

import type { ExternalContent } from "./content/external";
import type { OpenitiContent } from "./content/openiti";
import type { PdfContent } from "./content/pdf";
import type { TurathContent } from "./content/turath";

export type ApiBookParams = {
  fields?: ("indices" | "pdf" | "publication_details" | "headings")[];
  versionId?: string;
  locale?: string;
  startIndex?: number;
  size?: number;
  includeBook?: boolean;
};

export type ApiBookPageParams = {
  fields?: ("indices" | "pdf" | "publication_details" | "headings")[];
  versionId?: string;
  locale?: string;
  includeBook?: boolean;
  index: number;
};

export type ApiPageIndexParams = {
  versionId?: string;
  page: number;
  volume?: string | number;
};

type BookDetails = {
  id: string;
  slug: string;
  author: {
    id: string;
    slug: string;
    transliteration: string;
    year?: number | null;
    numberOfBooks: number;
    primaryName: string;
    otherNames: string[];
    secondaryName?: string | null;
    secondaryOtherNames?: string[] | null;
    bio: string;
  };
  transliteration: string;
  aiSupported: boolean;
  aiVersion: string;
  keywordSupported: boolean;
  keywordVersion: string;
  versions: PrismaJson.BookVersion[];
  numberOfVersions: number;
  primaryName: string;
  otherNames: string[];
  secondaryName?: string | null;
  secondaryOtherNames?: string[] | null;
  genres: {
    id: string;
    slug: string;
    transliteration: string;
    numberOfBooks: number;
    name: string;
    secondaryName: string;
  }[];
};

export type AlternateSlugResponse = {
  type: "alternate-slug";
  primarySlug: string;
};

export type ApiBookResponse = {
  book: BookDetails;
  content: TurathContent | ExternalContent | OpenitiContent | PdfContent;
  pagination: {
    startIndex: number;
    total: number;
    size: number; // per page
  };
};

export type ApiBookPageResponse = {
  book: BookDetails;
  content: TurathContent | OpenitiContent | PdfContent;
  pagination: {
    startIndex: number;
    total: number;
    size: number; // per page
  };
};

export type ApiPageIndexResponse = {
  index: number | null;
};

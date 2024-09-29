import type { TurathBookResponse } from "@/server/services/books";
import type { ParseResult } from "@openiti/markdown-parser";

export type ApiBookParams = {
  fields?: ("indices" | "pdf" | "publication_details" | "headings")[];
  versionId?: string;
  locale?: string;
  startIndex?: number;
  size?: number;
  includeBook?: boolean;
};

export type Turath = {
  source: TurathBookResponse["source"];
  versionId: TurathBookResponse["versionId"];
  pages: TurathBookResponse["turathResponse"]["pages"];

  chapterIndexToPageIndex?: TurathBookResponse["chapterIndexToPageIndex"];
  pageNumberWithVolumeToIndex?: TurathBookResponse["pageNumberWithVolumeToIndex"];

  pdf?: TurathBookResponse["turathResponse"]["pdf"];
  publicationDetails?: TurathBookResponse["turathResponse"]["publicationDetails"];
  headings?: TurathBookResponse["turathResponse"]["headings"];
};

export type External = {
  source: "external";
  versionId: string;
};

export type Openiti = {
  source: "openiti";
  versionId: string;
  rawUrl: string;
  pages: ParseResult["content"];
  publicationDetails?: ParseResult["metadata"];
  headings?: ParseResult["chapters"];
};

export type ApiBookResponse = {
  book: {
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
    versions: PrismaJson.BookVersion[];
    numberOfVersions: number;
    flags: PrismaJson.BookFlags;
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
  content: Turath | External | Openiti;
  pagination: {
    startIndex: number;
    total: number;
    size: number; // per page
  };
};

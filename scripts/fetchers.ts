import type { AuthorDocument } from "@/types/author";
import { dedupeStrings, removeDiacritics } from "./utils";
import type { BookDocument } from "@/types/book";
import { parseMarkdown } from "@openiti/markdown-parser";

type Book = {
  title_ar: string[];
  title_lat: string[];
  genre_tags: string[];
  versions: string[];
  relations: string[];
  uri: string; // gh uri authorUri.bookUri
};

type Author = {
  author_ar: string[];
  author_lat: string[];
  books: string[];
  date: string; // yyyy
  geo: string[];
  // name_elements: string[];
  // author_name_from_uri: string;
  full_name: string;
  shuhra: string;
  uri: string; // gh uri
  vers_uri: string;
};

const getNameVariations = (
  author: Awaited<
    ReturnType<typeof getAuthorsData | typeof getBooksData>
  >[number],
) => {
  const currentNames = [
    ...(author.primaryArabicName ? [author.primaryArabicName] : []),
    ...(author.primaryLatinName ? [author.primaryLatinName] : []),
    ...author.otherArabicNames,
    ...author.otherLatinNames,
  ];
  const newVariations: string[] = [];

  currentNames.forEach((name) => {
    const nameWithoutDiactrics = removeDiacritics(name);

    if (
      nameWithoutDiactrics !== name &&
      !currentNames.includes(nameWithoutDiactrics)
    )
      newVariations.push(nameWithoutDiactrics);

    const nameWithoutAl = nameWithoutDiactrics.replace(/(al-)/gi, "");
    if (
      nameWithoutAl !== nameWithoutDiactrics &&
      !currentNames.includes(nameWithoutAl)
    )
      newVariations.push(nameWithoutAl);
  });

  return newVariations;
};

export const getBooksData = async (): Promise<
  Omit<BookDocument, "author">[]
> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const booksData: Record<string, Book> = await (
    await fetch(
      "https://raw.githubusercontent.com/OpenITI/kitab-metadata-automation/master/output/OpenITI_Github_clone_all_book_meta.json?v1",
    )
  ).json();

  return Object.values(booksData)
    .filter((book: Book) => {
      // filter out books without uri or don't have arabic or latin title
      return (
        !!book.uri && (book.title_ar.length > 0 || book.title_lat.length > 0)
      );
    })
    .map((book: Book) => {
      const author = book.uri.split(".")[0];

      const [primaryArabicName, ...otherArabicNames] = dedupeStrings(
        book.title_ar,
      );
      const [primaryLatinName, ...otherLatinNames] = dedupeStrings(
        book.title_lat,
      );

      const result = {
        id: book.uri,
        authorId: author,
        primaryArabicName,
        otherArabicNames,
        primaryLatinName,
        otherLatinNames,
        genreTags: book.genre_tags,
        versionIds: book.versions,
      };

      return {
        ...result,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        _nameVariations: getNameVariations(result as any),
      } as Omit<BookDocument, "author">;
    });
};

export const getAuthorsData = async (): Promise<
  Omit<AuthorDocument, "books">[]
> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const authorsData: Record<string, Author> = await (
    await fetch(
      "https://raw.githubusercontent.com/OpenITI/kitab-metadata-automation/master/output/OpenITI_Github_clone_all_author_meta.json?v1",
      {
        cache: "no-store",
      },
    )
  ).json();

  return Object.values(authorsData).map((author: Author) => {
    const [primaryArabicName, ...otherArabicNames] = dedupeStrings(
      author.author_ar,
    );

    const latinNames = [...author.author_lat];
    if (author.shuhra.length > 0) {
      latinNames.unshift(author.shuhra); // use shuhra as a primary name if it exists
    }

    if (author.full_name.length > 0) {
      latinNames.push(author.full_name);
    }

    const [primaryLatinName, ...otherLatinNames] = dedupeStrings(latinNames);

    const result = {
      id: author.uri,
      year: Number(author.date),
      primaryArabicName,
      otherArabicNames,
      primaryLatinName,
      otherLatinNames,
      geographies: author.geo,
    };

    return {
      ...result,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      _nameVariations: getNameVariations(result as any),
    } satisfies Omit<AuthorDocument, "books">;
  });
};

export const getParsedBookVersions = async (
  bookId: string,
  versionIds: string[],
) => {
  const [authorId, bookName] = bookId.split(".");
  if (!authorId || !bookName) {
    return null;
  }

  const allVersions = await Promise.all(
    versionIds.map(async (versionId) => {
      const response = await fetch(
        `https://raw.githubusercontent.com/OpenITI/RELEASE/2385733573ab800b5aea09bc846b1d864f475476/data/${authorId}/${bookId}/${versionId}`,
      );
      const text = await response.text();

      return text;
    }),
  );

  return allVersions;
};

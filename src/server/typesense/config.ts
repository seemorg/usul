import { weightsMapToQueryBy, weightsMapToQueryWeights } from "./utils";

const authorQueryWeights = {
  2: ["primaryArabicName", "primaryLatinName"],
  1: ["_nameVariations", "otherArabicNames", "otherLatinNames"],
};

export const AUTHORS_COLLECTION = {
  INDEX: "authors",
  DEFAULT_PER_PAGE: 5,
  queryBy: weightsMapToQueryBy(authorQueryWeights),
  queryByWeights: weightsMapToQueryWeights(authorQueryWeights),
};

const booksQueryWeights = {
  4: ["primaryArabicName", "primaryLatinName"],
  3: ["_nameVariations", "otherArabicNames", "otherLatinNames"],
  2: ["author.primaryArabicName", "author.primaryLatinName"],
  1: [
    "author._nameVariations",
    "author.otherArabicNames",
    "author.otherLatinNames",
  ],
};

export const BOOKS_COLLECTION = {
  INDEX: "books",
  DEFAULT_PER_PAGE: 20,
  queryBy: weightsMapToQueryBy(booksQueryWeights),
  queryByWeights: weightsMapToQueryWeights(booksQueryWeights),
};

const genresQueryWeights = {
  1: ["name"],
};

export const GENRES_COLLECTION = {
  INDEX: "genres",
  DEFAULT_PER_PAGE: 5,
  queryBy: weightsMapToQueryBy(genresQueryWeights),
  queryByWeights: weightsMapToQueryWeights(genresQueryWeights),
};

const regionsQueryWeights = {
  2: ["name", "arabicName", "currentName"],
  1: ["subLocations"],
};

export const REGIONS_COLLECTION = {
  INDEX: "regions",
  DEFAULT_PER_PAGE: 5,
  queryBy: weightsMapToQueryBy(regionsQueryWeights),
  queryByWeights: weightsMapToQueryWeights(regionsQueryWeights),
};

const globalSearchQueryWeights = {
  4: ["primaryArabicName", "primaryLatinName"],
  3: ["_nameVariations", "otherArabicNames", "otherLatinNames"],
  2: ["author.primaryArabicName", "author.primaryLatinName"],
  1: [
    "author._nameVariations",
    "author.otherArabicNames",
    "author.otherLatinNames",
  ],
};

export const GLOBAL_SEARCH_COLLECTION = {
  INDEX: "all_documents",
  DEFAULT_PER_PAGE: 20,
  queryBy: weightsMapToQueryBy(globalSearchQueryWeights),
  queryByWeights: weightsMapToQueryWeights(globalSearchQueryWeights),
};

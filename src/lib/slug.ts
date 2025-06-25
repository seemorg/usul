import slugify from "slugify";

export const toSlug = (str: string) =>
  slugify(str, { lower: true, strict: true, trim: true });

import fs from "fs";

const author = "0728IbnTaymiyya";
const slug = "0728IbnTaymiyya.Tawba";

// https://raw.githubusercontent.com/OpenITI/kitab-metadata-automation/master/output/OpenITI_Github_clone_all_author_meta.json
const authorData = (
  await fetch(
    "https://raw.githubusercontent.com/OpenITI/kitab-metadata-automation/master/output/OpenITI_Github_clone_all_author_meta.json",
  ).then((res) => res.json())
)[author];
// console.log(authorData);

//
const bookData = (
  await fetch(
    "https://raw.githubusercontent.com/OpenITI/kitab-metadata-automation/master/output/OpenITI_Github_clone_all_book_meta.json",
  ).then((res) => res.json())
)[slug];

fs.writeFileSync(
  "./data.json",
  JSON.stringify({ author: authorData, book: bookData }, null, 2),
);

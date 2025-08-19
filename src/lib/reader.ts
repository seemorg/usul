const footnotesChar = "_________";

export const convertPageToHtml = (page: string) => {
  return page
    .replaceAll("</span>.", "</span>")
    .replaceAll("\n", "<br>")
    .split("<br>")
    .map((block) => {
      let final = block;

      const footnotesIndex = block.indexOf(footnotesChar);
      if (footnotesIndex > -1) {
        const txt = block.slice(0, footnotesIndex);
        const footnotes = block.slice(footnotesIndex + footnotesChar.length);

        final = txt + `<p class="footnotes">${footnotes}</p>`;
      }

      return `<div class="block">${final}</div>`;
    })
    .join("");
};

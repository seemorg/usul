const relativeUrl = (url: string) => {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
};

const loadFileOnEdgeAsArrayBuffer = async (url: string | URL) => {
  const res = await fetch(typeof url === "string" ? relativeUrl(url) : url);

  const arrayBuffer = await res.arrayBuffer();
  return arrayBuffer;
};

const loadFileOnEdgeAsBase64 = async (url: string | URL) => {
  const arrayBuffer = await loadFileOnEdgeAsArrayBuffer(url);

  // convert arrayBuffer to base64 using browser's api
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    ),
  );

  return base64;
};

const loadFileOnEdgeAsImage = async (url: string | URL) => {
  const base64 = await loadFileOnEdgeAsBase64(url);
  return `data:image/png;base64,${base64}`;
};

// @ts-ignore
const loadFileOnEdge: typeof loadFileOnEdgeAsArrayBuffer & {
  asArrayBuffer: typeof loadFileOnEdgeAsArrayBuffer;
  asBase64: typeof loadFileOnEdgeAsBase64;
  asImage: typeof loadFileOnEdgeAsImage;
} = loadFileOnEdgeAsArrayBuffer;

loadFileOnEdge.asArrayBuffer = loadFileOnEdgeAsArrayBuffer;
loadFileOnEdge.asBase64 = loadFileOnEdgeAsBase64;
loadFileOnEdge.asImage = loadFileOnEdgeAsImage;

export { loadFileOnEdge };

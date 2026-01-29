export async function fetchImageToBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const contentType = res.headers.get("content-type") || "image/jpeg";

    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    console.error(`Error fetching image from ${url}: ${err.message}`);
    return null;
  }
}

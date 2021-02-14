import { blobToImage } from './blob-to-image';

export async function getImageViaUrl(url) {
  const blob = await fetch(url).then((r) => r.blob());
  const img = await blobToImage(blob);
  return img;
}

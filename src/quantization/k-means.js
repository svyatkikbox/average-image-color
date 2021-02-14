export function kMeans() {
  const points = imageData.data.length / 4;
  const kMeans = Array(3);

  const centroids = Array.from(kMeans.keys()).map((n) =>
    Math.floor(Math.random() * points + 1)
  );
}

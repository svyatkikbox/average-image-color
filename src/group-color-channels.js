export async function extractPixelData(imageData) {
  // каждые 4 элемента - группа данных вида RGBA
  const colours = [];
  for (let i = 0; i < imageData.length; i += 4) {
    colours.push([
      imageData[i],
      imageData[i + 1],
      imageData[i + 2],
      imageData[i + 3]
    ]);
  }
  return colours;
}

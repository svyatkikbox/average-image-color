onmessage = function (e) {
  const imageData = new ImageData(
    new Uint8ClampedArray(e.data.buffer),
    e.data.width,
    e.data.height
  );
  const pixelsAmount = imageData.data.length / 4;
  const rgb = { r: 0, b: 0, g: 0 };

  function sumRGB(r, g, b) {
    rgb.r += r;
    rgb.g += g;
    rgb.b += b;
  }

  // Group info abount every pixel's channel in object
  for (let i = 0; i < pixelsAmount; i++) {
    const offset = i * 4;
    const r = imageData.data[offset];
    const g = imageData.data[offset + 1];
    const b = imageData.data[offset + 2];

    sumRGB(r, g, b);
  }

  rgb.r = ~~(rgb.r / pixelsAmount);
  rgb.g = ~~(rgb.g / pixelsAmount);
  rgb.b = ~~(rgb.b / pixelsAmount);

  postMessage(rgb);
};

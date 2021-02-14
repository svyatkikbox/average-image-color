onmessage = function (e) {
  const imageData = new ImageData(
    new Uint8ClampedArray(e.data.buffer),
    e.data.width,
    e.data.height
  );
  const pixelsAmount = imageData.data.length / 4;
  const pixels = [];
  let maxR = 0,
    maxG = 0,
    maxB = 0,
    minR = 255,
    minG = 255,
    minB = 255;
  const rgb = { r: 0, b: 0, g: 0, r2: 0, b2: 0, g2: 0 };

  function sumRGB(r, g, b) {
    rgb.r += r;
    rgb.g += g;
    rgb.b += b;
  }

  function sumRGB2(r, g, b) {
    rgb.r2 += r ** 2;
    rgb.g2 += g ** 2;
    rgb.b2 += b ** 2;
  }

  function recalculateChannelsExtremum(r, g, b) {
    maxR = Math.max(r, maxR);
    maxG = Math.max(g, maxG);
    maxB = Math.max(b, maxB);

    minR = Math.min(r, minR);
    minG = Math.min(g, minG);
    minB = Math.min(b, minB);
  }

  console.time('a');
  // Group info abount every pixel's channel in object
  for (let i = 0; i < pixelsAmount; i++) {
    const offset = i * 4;
    const r = imageData.data[offset];
    const g = imageData.data[offset + 1];
    const b = imageData.data[offset + 2];
    const a = imageData.data[offset + 3];

    // If pixel is mostly opaque and not white
    if (typeof a === 'undefined' || a >= 125) {
      if (!(r > 250 && g > 250 && b > 250)) {
        recalculateChannelsExtremum(r, g, b);
        sumRGB(r, g, b);
        sumRGB2(r, g, b);
        pixels.push([r, g, b]);
      }
    }
  }
  console.timeEnd('a');

  console.log(maxR, maxG, maxB);
  console.log(minR, minG, minB);

  const maxRangeChannel = (maxs, mins) => {
    const ranges = maxs.map((max, idx) => max - mins[idx]);
    const maxRange = Math.max(...ranges);
    console.log(ranges);
    return { maxRange, channelIdx: ranges.indexOf(maxRange) };
  };

  rgb.r = ~~(rgb.r / pixelsAmount);
  rgb.g = ~~(rgb.g / pixelsAmount);
  rgb.b = ~~(rgb.b / pixelsAmount);

  rgb.r2 = ~~Math.sqrt(rgb.r2 / pixelsAmount);
  rgb.g2 = ~~Math.sqrt(rgb.g2 / pixelsAmount);
  rgb.b2 = ~~Math.sqrt(rgb.b2 / pixelsAmount);

  console.log(rgb);
  console.log(maxRangeChannel([maxR, maxG, maxB], [minR, minG, minB]));

  postMessage(rgb);
};

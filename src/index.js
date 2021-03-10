import { blobToImage } from './blob-to-image';
import { getImageViaUrl } from './get-image-via-url';

import './styles.scss';

const imgUrl = document.querySelector('.img-url');
const linkLoader = document.querySelector('.link-loader');
const imgPreview = document.querySelector('.img-preview');
const fileLoader = document.querySelector('.file-loader');
const fileInput = document.querySelector('#file-loader');
const colorCircle = document.querySelector('.color-circle');
const colorcode = colorCircle.querySelector('.color-code');
const canvas = document.createElement('canvas');

const ctx = canvas.getContext('2d');
const worker = new Worker('worker.js');

worker.onmessage = function (e) {
  const { r, g, b } = e.data;
  console.log(r, g, b);
  showColor({ r, g, b });
};

function clearPreview(imgPreview) {
  while (imgPreview.firstChild) {
    imgPreview.removeChild(imgPreview.firstChild);
  }
}

function drawImageToCanvas(img, canvas) {
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
}

function fitCanvasToImage(img, canvas) {
  canvas.width = img.width;
  canvas.height = img.height;
}

function processImage(img, canvas) {
  clearPreview(imgPreview);
  imgPreview.append(img);
  fitCanvasToImage(img, canvas);
  drawImageToCanvas(img, canvas);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);

  worker.postMessage(
    {
      buffer: imageData.data.buffer,
      width: img.width,
      height: img.height
    },
    [imageData.data.buffer]
  );
}

function rgbToHex({ r, g, b }) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;

  return '#' + r + g + b;
}

function showColor({ r, g, b }) {
  requestAnimationFrame(() => {
    Object.assign(colorCircle.style, {
      backgroundColor: `rgb(${r},${g},${b})`,
      opacity: 1
    });
    colorcode.innerText = rgbToHex({ r, g, b }).toUpperCase();
  });
}

linkLoader.addEventListener('click', function () {
  getImageViaUrl(imgUrl.value)
    .then((img) => processImage(img, canvas))
    .catch((err) => console.log(err));
});

fileLoader.addEventListener('change', function () {
  blobToImage(fileInput.files[0]).then((img) => processImage(img, canvas));
});

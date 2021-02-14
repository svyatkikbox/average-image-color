import { blobToImage } from './blob-to-image';
import { getImageViaUrl } from './get-image-via-url';
import { drawImageToCanvas } from './draw-image-to-canvas';
import './styles.scss';
import './icons/cloud.svg';

const imgUrl = document.querySelector('.img-url');
const linkLoader = document.querySelector('.link-loader');
const imgPreview = document.querySelector('.img-preview');
const fileLoader = document.querySelector('.file-loader');
const fileInput = document.querySelector('#file-loader');
const colorCircle = document.querySelector('.color-circle');
const colorCircle2 = document.querySelector('.color-circle--2');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const worker = new Worker('worker.js');

worker.onmessage = function (e) {
  console.log('Message received from worker', e.data);
  const { r, g, b, r2, g2, b2 } = e.data;
  colorCircle.style.backgroundColor = `rgb(${r},${g},${b})`;
  colorCircle2.style.backgroundColor = `rgb(${r2},${g2},${b2})`;
};

function fitAspectRatio(img) {
  const wMax = 500;
  const aspectRatio = img.width / img.height;

  if (img.width === img.height) {
  }

  if (img.width > img.height) {
    img.width = img.width > wMax ? wMax : img.width;
    img.height = img.width / aspectRatio;
  }

  if (img.width < img.height) {
  }

  return img;
}

function processImage(img, canvas) {
  // fitAspectRatio(img);

  while (imgPreview.firstChild) {
    imgPreview.removeChild(imgPreview.firstChild);
  }

  imgPreview.append(img);

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

linkLoader.addEventListener('click', function () {
  getImageViaUrl(imgUrl.value)
    .then((img) => processImage(img, canvas))
    .catch((err) => console.log(err));
});

fileLoader.addEventListener('change', function () {
  blobToImage(fileInput.files[0]).then((img) => processImage(img, canvas));
});

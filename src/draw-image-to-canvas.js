export function drawImageToCanvas(img, canvas) {
  const ctx = canvas.getContext('2d');

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);
}

export const blobToImage = (blob) => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.src = url;
  });
};
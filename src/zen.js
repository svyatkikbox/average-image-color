(() => {
  const config = {
    cardTypes: {
      image: {
        actions: [getImageUrl]
      },
      carousel: {
        actions: [getCarouselImageUrls]
      },
      gallery: {
        actions: [getGalleryImageUrls]
      },
      video: {
        actions: [getVideoPreviewUrls]
      }
    }
  };

  const getUrlFromBackgroundImage = (bgi) =>
    bgi?.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

  const transformImageUrlInOriginal = (url, originalPostfix) => {
    url = url.split('/');
    url[url.length - 1] = originalPostfix;
    url = url.join('/');
    return url;
  };

  const channelName = document.querySelector('.desktop-channel-2-top__title')
    .innerText;

  const channelBannerImgUrl = getUrlFromBackgroundImage(
    document
      .querySelector('.desktop-channel-2-header-layout__top-image')
      ?.style.backgroundImage.split(',')[0]
  );

  const channelAvaImgUrl = getUrlFromBackgroundImage(
    document.querySelector('.desktop-channel-2-top__logo').style.backgroundImage
  );

  const getCards = () =>
    Array.from(document.querySelectorAll('.card-wrapper__inner'));

  const getCardType = (card) => {
    const extractTypeFromClassName = (className) => className.split('-')[1];
    const child = card.querySelector('div');

    cardType = extractTypeFromClassName(child.className);
    return cardType;
  };

  const processCard = (card) => {
    try {
      const cardType = getCardType(card);
      const { actions } = config.cardTypes[cardType];
      const data = actions.map((action) => action(card));

      return { [cardType]: data.flat(2) };
    } catch (error) {}
  };

  // Card type actions
  // image
  function getImageUrl(card) {
    const blurImage = card.querySelector('.blur-image__image');
    const fadeImage = card.querySelector('.fade-image');
    const originalImagePostfix = 'orig';

    if (blurImage) {
      const url = getUrlFromBackgroundImage(blurImage.style.backgroundImage);
      return transformImageUrlInOriginal(url, originalImagePostfix);
    }

    if (fadeImage) {
      const image = fadeImage.querySelector('.fade-image__image');
      const url = getUrlFromBackgroundImage(image.style.backgroundImage);
      return transformImageUrlInOriginal(url, originalImagePostfix);
    }
  }

  // carousel
  function getCarouselImageUrls(card) {
    const carouselItems = Array.from(
      card.querySelectorAll('img.card-carousel-image-item__image')
    );
    const originalPostfix = 'scale_1080';
    const imageUrls = carouselItems.map((item) =>
      transformImageUrlInOriginal(item.src, originalPostfix)
    );
    return imageUrls;
  }

  // gallery
  function getGalleryImageUrls(card) {
    const galleryItems = Array.from(
      card.querySelectorAll('.card-gallery-desktop-image-composition__image')
    );
    const originalPostfix = 'scale_1080';
    const imageUrls = galleryItems.map((item) => {
      const url = getUrlFromBackgroundImage(item.style.backgroundImage);
      return transformImageUrlInOriginal(url, originalPostfix);
    });
    return imageUrls;
  }

  // video
  function getVideoPreviewUrls(card) {
    const videoPreview = card.querySelector(
      '.video-image-preview .video-image-preview__full-image'
    );
    const originalImagePostfix = 'orig';
    const url = getUrlFromBackgroundImage(videoPreview.style.backgroundImage);
    return transformImageUrlInOriginal(url, originalImagePostfix);
  }

  const urls = getCards()
    .map((card) => processCard(card))
    .flat(2);

  const data = Object.create(null);

  Object.assign(data, {
    channelName: channelName ? channelName : '',
    channelBannerImgUrl: channelBannerImgUrl ? channelBannerImgUrl : '',
    channelAvaImgUrl: channelAvaImgUrl ? channelAvaImgUrl : '',
    ...urls
  });

  return data;
})();

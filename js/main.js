const apiUrl = "https://banners-website.wildberries.ru/public/v1";

const LOCATION_TYPES = {
  SLIDE: 42,
  BANNER: 38,
};

const CLASSES = {
  BANNER: {
    ITEM: "banners__item",
    LINK: "banners__link",
    IMG: "banners__img",
  },
  SLIDER: {
    ITEM: "swiper-slide",
  },
};

function fetchBanners(params) {
  return fetch(prepareUrl("banners", params)).then((r) => r.json());
}

function prepareUrl(path, params) {
  const url = new URL(`${apiUrl}/${path}`);
  const searchParams = new URLSearchParams(url.search);

  for (const key in params) {
    searchParams.append(key, params[key]);
  }

  return `${url}?${searchParams}`;
}

window.addEventListener("load", () => {
  fetchBanners({
    urltype: 1024,
    apptype: 1,
    displaytype: 2,
    longitude: 37.6201,
    latitude: 55.753737,
    country: 1,
    culture: "ru",
  }).then((response) => {
    const { banners, slides } = response.reduce(
      (acc, b) => {
        if (b.LocationType === LOCATION_TYPES.SLIDE) {
          acc["slides"].push(b);
        } else if (b.LocationType === LOCATION_TYPES.BANNER) {
          acc["banners"].push(b);
        }
        return acc;
      },
      { banners: [], slides: [] }
    );

    initSlider(slides);
    initBanners(banners);
  });
});

function initSlider(banners) {
  const fragment = document.createDocumentFragment();

  for (const banner of banners) {
    const item = createElement("div", CLASSES.SLIDER.ITEM);
    const img = createElement("img");
    img.src = getImageSrc(banner.Src);

    item.append(img);
    fragment.append(item);
  }

  document.querySelector(".js-swiper-wrapper").append(fragment);

  initSwiper();
}

function initBanners(banners) {
  const fragment = document.createDocumentFragment();

  for (const banner of banners) {
    const item = createElement("li", CLASSES.BANNER.ITEM);
    const img = createElement("img", CLASSES.BANNER.IMG);
    img.src = getImageSrc(banner.Src);

    item.append(img);
    fragment.append(item);
  }

  const target = document.querySelector(".js-banners-list");
  target.innerHTML = "";
  target.append(fragment);
}

function getImageSrc(src) {
  return `https://static-basket-01.wb.ru/vol1/crm-bnrs${src}`;
}

function createElement(tag, className) {
  const el = document.createElement(tag);
  className && el.classList.add(className);
  return el;
}

function initSwiper() {
  new Swiper(".swiper", {
    direction: "horizontal",
    loop: true,
    autoheight: true,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

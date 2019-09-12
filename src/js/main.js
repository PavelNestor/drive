"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const prevSlide = $('#prev-slide');
const nextSlide = $('#next-slide');
const mainLinks = $$('.main-links');

let slidesIndex = [1, 1];
const slidesId = ['main-slides', 'lamb-slides'];
const linksId = ['main-links', 'lamb-links'];
let timer = null;

showSlides(1, 0);

function nextSlides(id) {
  console.log('next ->', slidesIndex[id] )
  clearTimeout(timer);
  showSlides((slidesIndex[id] += 1), id);
}

function currentSlide(index, id) {
  let res = slidesIndex[id] = index
  showSlides(res, id);
}

function prewSlides(id) {
  console.log('prew ->', slidesIndex[id] )
  clearTimeout(timer);
  showSlides((slidesIndex[id] += -1), id);
}

function showSlides(index, slideId) {
  console.log('index ->', index);
  console.log('slideId ->', slideId);
  
  const currentSlides = $$(`.${slidesId[slideId]}`);
  console.log('slidesId ->', slidesId[slideId]);
  console.log('currentSlides ->', currentSlides);
  console.log('index > currentSlides.length ->', currentSlides.length);
  
  if (index > currentSlides.length) {
    slidesIndex[slideId] = 1;
  } else if (index < 1){
    slidesIndex[slideId] = currentSlides.length;
  } else {
    slidesIndex[slideId] = index;
  }

  currentSlides.forEach(slide => slide.classList.add('hidden'));
  // currentLinks.forEach(link => link.classList.remove(`${linksId[slideId]}_active`));
  mainLinks.forEach(link => link.classList.remove(`active`));
  
  // currentLinks.forEach((carLink, index) => carLink.addEventListener('click', () => currentSlide(index + 1, slideId)));

  currentSlides[slidesIndex[slideId] - 1].classList.remove('hidden');
  // currentLinks[slidesIndex[slideId] - 1].classList.add(`${linksId[slideId]}_active`);
  mainLinks[slidesIndex[slideId] - 1].classList.add('active');
  // currentLinks[slidesIndex[slideId] - 1].removeEventListener('click', currentSlide);

  // timer = setTimeout(() => {
  //   showSlides(slidesIndex[slideId] + 1, slideId);
  // }, 6000);
  
}

prevSlide.addEventListener('click', () => prewSlides(0));
nextSlide.addEventListener('click', () => nextSlides(0));


// loading status
const loading = {
  avgTime: 3000,
  finished: false,
  preloader: document.querySelector('.preloader'),
  preloaderBar: document.querySelector('.preloader > .preloaderBar'),
  state: 0,
  trg: 1,

  loaded: function (force) {
    if(++loading.state === loading.trg || force === true) {
      loading.status(1);
      setTimeout(loading.done, 500);
    } else {
      loading.status(loading.state / loading.trg / 1.1);
    }
  },

  status: function (mult) {
    if (loading.finished) {
      return;
    }
    const value = Math.ceil(mult * 100);
    loading.preloaderBar.style.width = `${value}%`;
  },

  restart: function () {
    loading.status(0);
    loading.preloader.classList.remove('preloader_loaded');
  },

  done: function () {
    if (loading.finished) {
      return;
    }

    // hide preloader
    loading.preloader.classList.add('preloader_loaded');
    loading.status(0);
    loading.finished = true;

  }
};

// force loading status
setTimeout(function () {
  loading.loaded(true);
}, 10000);

// on load
window.onload = function() {
  loading.loaded(true);
};

// on ready
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  const images = Array.from( document.querySelectorAll('img') );
  images.forEach(image => {
    if (image.complete) {
      return;
    }
    loading.trg++;
    image.addEventListener('load', loading.loaded);
  });

  const links = Array.from( document.querySelectorAll('a') );
  links.forEach(link => {
    const href = link.getAttribute('href');
    const ifNoReload = new RegExp('^#|mailto|tel').test(href);

    if (!href || ifNoReload) {
      return;
    }

    link.addEventListener('click', e => {
      loading.restart();
      e.preventDefault();

      setTimeout(() => {
        document.location.href = href;
      }, 400);
    });
  });
});

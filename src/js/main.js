"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const prevSlide = $('#prev-slide');
const nextSlide = $('#next-slide');
const prevLambSlide = $('#prev-lamb-slide');
const nextLambSlide = $('#next-lamb-slide');
const prevFordSlide = $('#prev-ford-slide');
const nextNissanSlide = $('#next-nissan-slide');
const prevNissanSlide = $('#prev-nissan-slide');
const nextFordSlide = $('#next-ford-slide');
const mainLinks = $$('.main-links');
const lambLinks = $$('.lamb-links');

let slidesIndex = [1, 1, 1, 1];
const slidesId = ['main-slides', 'lamb-slides', 'ford-slides', 'nissan-slides'];
const linksId = ['main-links', 'lamb-links', 'ford-links', 'nissan-links'];
let timer = null;

let scrollPosition = 0;
let lastScrollPosition = 0;
let isMobie = document.documentElement.clientWidth < 1024;
let carMenu = $('.car-list-menu');
let lambSection = $('.lamborghini');

// Sliders
// const slidersElements = $$('.sliders');
// let sliders = [];

// slidersElements.forEach(sliderElem => {
//   let name = sliderElem.dataset.slider;
//   sliders.push({
//     sliderName: `${name}-slides`,
//     linkName: `${name}-links`,
//     sliderIndex: 1
//   });
// });

slidesIndex.forEach((slide, index) => showSlides(slide, index))

function nextSlides(id) {
  clearTimeout(timer);
  showSlides((slidesIndex[id] += 1), id);
}

function currentSlide(index, id) {
  let res = slidesIndex[id] = index + 1;
  showSlides(res, id);
}

function prewSlides(id) {
  clearTimeout(timer);
  showSlides((slidesIndex[id] += -1), id);
}

function showSlides(index, slideId) {
  const currentSlides = $$(`.${slidesId[slideId]}`);
  const currentLinks = $$(`.${linksId[slideId]}`);
  
  if (index > currentSlides.length) {
    slidesIndex[slideId] = 1;
  } else if (index < 1){
    slidesIndex[slideId] = currentSlides.length;
  } else {
    slidesIndex[slideId] = index;
  }

  mainLinks.forEach(link => link.classList.remove(`active`));
  currentSlides.forEach(slide => slide.classList.add('hidden'));

  currentSlides[slidesIndex[slideId] - 1].classList.remove('hidden');

  if(slideId === 0){
    mainLinks[slidesIndex[slideId] - 1].classList.add('active');

    timer = setTimeout(() => {
      showSlides(slidesIndex[slideId] + 1, slideId);
    }, 6000);
  }


  currentLinks.forEach(link => link.classList.remove(`${linksId[slideId]}_active`));
  currentLinks.forEach((carLink, index) => carLink.addEventListener('click', () => currentSlide(index, slideId)));

  currentLinks[slidesIndex[slideId] - 1].classList.add(`${linksId[slideId]}_active`);
  currentLinks[slidesIndex[slideId] - 1].removeEventListener('click', currentSlide);
}

prevSlide.addEventListener('click', () => prewSlides(0));
nextSlide.addEventListener('click', () => nextSlides(0));

prevLambSlide.addEventListener('click', () => prewSlides(1));
nextLambSlide.addEventListener('click', () => nextSlides(1));

prevFordSlide.addEventListener('click', () => prewSlides(2));
nextFordSlide.addEventListener('click', () => nextSlides(2));


prevNissanSlide.addEventListener('click', () => prewSlides(3));
nextNissanSlide.addEventListener('click', () => nextSlides(3));


// show navbar

function onScroll() {
  const scrollPosition = document.body.getBoundingClientRect().top;
  const lambSectionTop = lambSection.getBoundingClientRect().top;
  const isScrollDirectionBackwards = scrollPosition > lastScrollPosition;

  if (isScrollDirectionBackwards) {
    // UP SCROLL

    console.log('lambSectionTop',lambSectionTop);
    
    
    
    if (!isMobie && lambSectionTop < 0) {
      console.log('carMenu', carMenu);
      carMenu.classList.add('car-list-menu__active');
    }
  } else {
    carMenu.classList.remove('car-list-menu__active');
  }

  lastScrollPosition = scrollPosition;
}


function onResize() {
  isMobie = document.documentElement.clientWidth < 1024;
}

window.addEventListener('resize', onResize);

window.addEventListener('scroll', onScroll);


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
    console.log('value', value);
    
    if (value > 0) {
      loading.preloaderBar.style.width = `${value}%`;
    }
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

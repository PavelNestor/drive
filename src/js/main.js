"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const prevSlide = $('#prev-slide');
const nextSlide = $('#next-slide');
const mainLinks = $$('.main-links');
const mainSlides = $$('.main-slides');
const carName = $$('.content__car-name');

let mainSlideIndex = 1;
let timer = null;
let timerAnim = null;

let scrollPosition = 0;
let lastScrollPosition = 0;
let isMobie = document.documentElement.clientWidth < 1024;
let carMenu = $('.car-list-menu');
let lambSection = $('.lamborghini');
let welcomeSection = $('.welcome-screen');
let carsMenu = $('.cars-menu');
let testSection = $('.test-drive');
let animTimerElem = $('.anim-timer');

const cards = $$('.card');

// Sliders
const slidersElements = $$('.sliders');
let sliders = [];

slidersElements.forEach(sliderElem => {
  let name = sliderElem.dataset.slider;
  sliders.push({
    currentSlide: 0,
    links: $$(`.${name}-links`),
    name: name,
    slides: $$(`.${name}-slides`),
    prev: $(`#prev-${name}-slide`),
    next: $(`#next-${name}-slide`)
  });
});

showSlides(1);

function nextSlides() {
  clearTimeout(timer);
  clearTimeout(timerAnim);
  showSlides(mainSlideIndex += 1);
}

function currentSlide(index) {
  let res = mainSlideIndex = index + 1;
  showSlides(res);
}

function prewSlides() {
  clearTimeout(timer);
  clearTimeout(timerAnim);
  showSlides(mainSlideIndex += -1);
}

function showSlides(index) {
  if (index > mainLinks.length) {
    mainSlideIndex = 1;
  } else if (index < 1){
    mainSlideIndex = mainLinks.length;
  } else {
    mainSlideIndex = index;
  }

  // mainLinks.forEach(link => link.classList.remove(`active`));
  // mainLinks[mainSlideIndex - 1].classList.add('active');

  mainSlides.forEach(slide => slide.classList.add('hidden'));
  carName.forEach(slide => slide.classList.add('hidden'));
  mainSlides[mainSlideIndex - 1].classList.remove('hidden');
  
  mainSlides[mainSlideIndex - 1].classList.add('clipInLeft');

  //Animation for slide line Start
  animTimerElem.classList.add('clipInLeftForLine');

  animTimerElem.addEventListener("animationend", () => {
    animTimerElem.classList.remove(`clipInLeftForLine`);
    animTimerElem.classList.add('clipOutRightForLine');
    animTimerElem.addEventListener("animationend", () => {
      animTimerElem.classList.remove(`clipOutRightForLine`);
    }, false);
  }, false);
  //Animation for slide line End

  mainSlides[mainSlideIndex - 1].addEventListener("animationend", () => {
    carName[mainSlideIndex - 1].classList.remove('hidden');
    carName[mainSlideIndex - 1].classList.add('clipInLeft');
    setTimeout(() => {
      mainSlides.forEach(slide => slide.classList.remove(`clipInLeft`));
      carName.forEach(slide => slide.classList.remove(`clipInLeft`));
    }, 500);
  }, false);

  timerAnim = setTimeout(() => {
    mainSlides[mainSlideIndex - 1].classList.add('clipOutRight');
    carName[mainSlideIndex - 1].classList.add('clipOutRight');
  }, 4400);

  mainSlides[mainSlideIndex - 1].addEventListener("animationend", () => {
    mainSlides.forEach(slide => slide.classList.remove(`clipOutRight`));
    carName.forEach(slide => slide.classList.remove(`clipOutRight`));
  }, false);

  timer = setTimeout(() => {
    showSlides(mainSlideIndex + 1);
  }, 6000);
}

prevSlide.addEventListener('click', () => prewSlides(0));
nextSlide.addEventListener('click', () => nextSlides(0));

// show navbar
function onScroll() {
  const scrollPosition = document.body.getBoundingClientRect().top;
  const testSectionTop = testSection.getBoundingClientRect().top;

  carMenu.classList.add('car-list-menu__active');
  if (testSectionTop + 100 < 0) {
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

  sliders.forEach(sliderItem => {
    if (sliderItem.name !== 'main') {
      const slider = new Slider(sliderItem);
      slider.links.forEach((link, index) => link.addEventListener('click', () => slider.toSlide(index)));
      slider.prev.addEventListener('click', () => slider.prevSlide());
      slider.next.addEventListener('click', () => slider.nextSlide());
      slider.showSlide();
    }
  });

  carMenu.classList.add('car-list-menu__active');

});

// Class for sliders
class Slider {
  constructor(options) {
    const DEFAULT_OPTIONS = {
      currentSlide: 0,
      links: [],
      name: '',
      slides: null,
      prev: null,
      next: null
    }
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    Object.assign(this, options);
  }

  prevSlide() {
    this.currentSlide--
    if (this.currentSlide < 0){
      this.currentSlide = this.slides.length - 1;
    }
    this.showSlide();
  }

  nextSlide() {
    this.currentSlide++
    if (this.currentSlide > this.slides.length - 1) {
      this.currentSlide = 0;
    }
    this.showSlide();

    // const incrementedCurrentSlide = this.currentSlide + 1;
    // const newSlide = incrementedCurrentSlide < this.slides.length - 1 ?
    //   incrementedCurrentSlide : 0;
  }

  toSlide(index) {
    this.currentSlide = index;
    this.showSlide(this.currentSlide);
  }

  showSlide() {
    this.slides.forEach(slide => slide.classList.add('hidden'));
    this.slides[this.currentSlide].classList.remove('hidden');

    this.links.forEach(link => link.classList.remove(`${this.name}-slides_active`));
    this.links[this.currentSlide].classList.add(`${this.name}-slides_active`);
    this.links[this.currentSlide].removeEventListener('click', this.toSlide);
  }
}

// cards
cards.forEach((card, index) => card.addEventListener('mouseover', () => cardOnMouseOver(index)));
cards[0].classList.add('card-over');

function cardOnMouseOver(index) {
  cards.forEach(card => card.classList.remove('card-over'));
  cards[index].classList.add('card-over');
}

// Main Animation

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
const wrappers = $$('.sliders');
const cards = $$('.card');
const navLangWrap = $('.navbar__lang-wrap');
const navLangItemWrap = $('.navbar__lang-item-wrap');
let isMainAnimFinish = true;

AOS.init({
  once: true,
  mirror: true,
  initClassName: 'aos-init',
  animatedClassName: 'aos-animate',
  easing: 'ease',
  offset: 400,
  delay: 100,
  duration: 600,
  anchorPlacement: 'center-top',
});


//toogle lang
const toogleLang = () => {
  navLangItemWrap.classList.toggle('navbar__lang-item-wrap_visible');
}

navLangWrap.addEventListener('click', toogleLang);

// menu-togler
const burgerOpen = $('#burger');
const burgerClose = $('#burger-close');
const menuMobile = $('#menu-mobile');
const menuMobileLinks = $$('.menu-mobile__link');

const openMenu = () => {
  menuMobile.classList.add('menu-mobile_visible');
};

const closeMenu = () => {
  // navEl.classList.remove('navbar_active');
  menuMobile.classList.remove('menu-mobile_visible');
};

menuMobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Sliders
const slidersElements = $$('.sliders');
let sliders = [];

slidersElements.forEach((sliderElem, index) => {
  let name = sliderElem.dataset.slider;
  sliders.push({
    currentSlide: 0,
    links: $$(`.${name}-links`),
    name: name,
    slides: $$(`.${name}-slides`),
    prev: $(`#prev-${name}-slide`),
    next: $(`#next-${name}-slide`),
    wrapper: wrappers[index],
    animClass: name == 'ford' ? 'clipInLeft': 'clipInRight'
  });
});
AOS.refresh();
showSlides(1);

function nextSlides() {
  if (!isMainAnimFinish) {
    return;
  };

  clearTimeout(timer);
  clearTimeout(timerAnim);
  showSlides(mainSlideIndex += 1);
}

function currentSlide(index) {
  if (!isMainAnimFinish) {
    return;
  };

  let res = mainSlideIndex = index + 1;
  showSlides(res);
}

function prewSlides() {
  if (!isMainAnimFinish) {
    return;
  };

  clearTimeout(timer);
  clearTimeout(timerAnim);
  showSlides(mainSlideIndex += -1);
}

function showSlides(index) {
  if (!isMainAnimFinish) {
    return;
  };

  if (index > mainSlides.length) {
    mainSlideIndex = 1;
  } else if (index < 1){
    mainSlideIndex = mainSlides.length;
  } else {
    mainSlideIndex = index;
  }

  isMainAnimFinish = false;

  //Animation for slide line Start
  animTimerElem.classList.remove(`clipInRightForLine`);
  setTimeout(() => {
    animTimerElem.classList.add('clipInRightForLine');
  }, 1000);
  //Animation for slide line End

  mainSlides.forEach(slide => slide.classList.add('hidden'));
  carName.forEach(slide => slide.classList.add('hidden'));

  mainSlides[mainSlideIndex - 1].classList.remove('hidden');
  mainSlides[mainSlideIndex - 1].classList.add('clipInLeft');

  setTimeout(() => {
    carName[mainSlideIndex - 1].classList.remove('hidden');
    carName[mainSlideIndex - 1].classList.add('clipInLeft');
  }, 1000);

  setTimeout(() => {
    isMainAnimFinish = true;
  }, 2000);

  // carName[mainSlideIndex - 1].addEventListener("animationend", () => {
  //   carName[mainSlideIndex - 1].classList.remove(`clipInLeft`);
  //   console.log('isMainAnimFinish', isMainAnimFinish);
    
  // }, false);


  timerAnim = setTimeout(() => {
    mainSlides[mainSlideIndex - 1].classList.remove(`clipInLeft`);
    carName[mainSlideIndex - 1].classList.remove(`clipInLeft`);

    mainSlides[mainSlideIndex - 1].classList.add('clipOutRight');
    carName[mainSlideIndex - 1].classList.add('clipOutRight');

    mainSlides[mainSlideIndex - 1].addEventListener("animationend", () => {
      mainSlides[mainSlideIndex - 1].classList.remove(`clipOutRight`);
      carName[mainSlideIndex - 1].classList.remove(`clipOutRight`);
    }, false);
  }, 7000);

  

  timer = setTimeout(() => {
    showSlides(mainSlideIndex + 1);
  }, 8000);
}

prevSlide.addEventListener('click', () => prewSlides(0));
nextSlide.addEventListener('click', () => nextSlides(0));

const navEl = $('.navbar');
AOS.refresh();
// show navbar
function onScroll() {
  const winHeight = window.innerHeight;
  const scrollPosition = document.body.getBoundingClientRect().top;
  const testSectionTop = testSection.getBoundingClientRect().top;
  const testSectionBottom = testSection.getBoundingClientRect().bottom;
  const isScrollDirectionBackwards = lastScrollPosition < scrollPosition;
  AOS.refresh();
  if (isScrollDirectionBackwards && testSectionTop < 0) {
    navEl.classList.add('navbar_active');
  } else {
    navEl.classList.remove('navbar_active');
  }

  carMenu.classList.add('car-list-menu__active');
  
  if (testSectionBottom < winHeight) {
    carMenu.classList.remove('car-list-menu__active');
  }

  lastScrollPosition = scrollPosition;
};

function onResize() {
  isMobie = document.documentElement.clientWidth < 1024;
};

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

  burgerOpen.addEventListener('click', openMenu);
  burgerClose.addEventListener('click', closeMenu);

});

// Class for sliders
class Slider {
  constructor(options) {
    const DEFAULT_OPTIONS = {
      currentSlide: 0,
      lastSlide: 0,
      links: [],
      name: '',
      slides: null,
      prev: null,
      next: null,
      wrapper: null,
      animClass: '',
      isAnimFinish: true
    }
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    Object.assign(this, options);
  }

  prevSlide() {
    if (!this.isAnimFinish) {
      return;
    };

    this.currentSlide--
    if (this.currentSlide < 0){
      this.currentSlide = this.slides.length - 1;
    }
    this.showSlide();
  }

  nextSlide() {
    if (!this.isAnimFinish) {
      return;
    };

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
    if (!this.isAnimFinish) {
      return;
    };
    this.currentSlide = index;
    this.showSlide(this.currentSlide);
  }

  showSlide() {
    if (!this.isAnimFinish) {
      return;
    };

    this.isAnimFinish = false;

    const url = this.slides[this.currentSlide].querySelector('img').getAttribute('srcset');
    
    this.slides.forEach(slide => slide.classList.add('hidden'));
    this.slides[this.currentSlide].classList.remove('hidden');
    
    this.slides[this.currentSlide].classList.add(this.animClass);
    
    this.slides[this.currentSlide].addEventListener("animationend", () => {
      this.slides[this.currentSlide].classList.remove(this.animClass);
      if (this.currentSlide == 0) {
        this.wrapper.style.background  = `url(${url}) no-repeat center center / 112% 100%`;
      } else {
        this.wrapper.style.background  = `url(${url}) no-repeat center center / cover`;
      }
      this.isAnimFinish = true;
    }, false);

    this.links.forEach(link => link.classList.remove(`${this.name}-slides_active`));
    this.links[this.currentSlide].classList.add(`${this.name}-slides_active`);
    this.links[this.currentSlide].removeEventListener('click', this.toSlide);

    this.lastSlide = this.currentSlide;
  }
}

// cards
cards.forEach((card, index) => card.addEventListener('mouseover', () => cardOnMouseOver(index)));
cards[0].classList.add('card-over');

function cardOnMouseOver(index) {
  cards.forEach(card => card.classList.remove('card-over'));
  cards[index].classList.add('card-over');
}

// Price Animation
const priceEl = $$('.price-anim');
const priceCard = $$('.price-card__image-wrap');
let windowLastScrollPosition = 0;

function addSlideDownAnimation() {
  let windowScrollPosition = window.scrollY;
  const isScrollDirectionBackwards = windowScrollPosition > windowLastScrollPosition;

  if (isScrollDirectionBackwards) {
    priceEl.forEach(element =>{
      let top = element.getBoundingClientRect().top;
      let offset = (window.innerHeight/10)*9;
      element.classList.remove('visible');

      if ( top < offset) {
        element.classList.add('slideInDown');
        element.classList.add('visible');
      } else {
        element.classList.remove('slideInDown');
      }

    });
  } else {
    priceEl.forEach(element => element.classList.add('visible'));
  }
  windowLastScrollPosition = windowScrollPosition;
};

window.addEventListener('scroll', addSlideDownAnimation);

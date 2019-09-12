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

"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// const slides = $$('.slides');
// const carLinks = $$('.car-links');
const prevSlide = $('#prev-slide');
const nextSlide = $('#next-slide');

let slidesIndex = [1, 1];
var slidesId = ['main-slides', 'lamb-slides']
var linksId = ['main-links', 'lamb-links']

showSlides(1, 0);

function nextSlides(id) {
  showSlides((slidesIndex[id] += 1), id);
}

function currentSlide(index, id) {
  let res = slidesIndex[id] = index
  showSlides(res, id);
}

function prewSlides(id) {
  showSlides((slidesIndex[id] += -1), id);
}

function showSlides(index, slideId) {
  console.log('slidesIndex', slidesIndex);
  
  const currentSlides = $$(`.${slidesId[slideId]}`);
  console.log('slideId', index);
  
  const currentLinks = $$(`.${linksId[slideId]}`);

  console.log('index > currentSlides.length', currentSlides.length);
  
  
  if (index > currentSlides.length) {
    slidesIndex[slideId] = 1;
  } else if (index < 1){
    slidesIndex[slideId] = currentSlides.length -1;
  } else {
    slidesIndex[slideId] = index;
  }

  currentSlides.forEach(slide => slide.classList.add('hidden'));
  currentLinks.forEach(link => link.classList.remove(`${linksId[slideId]}_active`));
  
  currentLinks.forEach((carLink, index) => carLink.addEventListener('click', () => currentSlide(index + 1, slideId)));

  currentSlides[slidesIndex[slideId] - 1].classList.remove('hidden');
  currentLinks[slidesIndex[slideId] - 1].classList.add(`${linksId[slideId]}_active`);
  currentLinks[slidesIndex[slideId] - 1].removeEventListener('click', currentSlide)
}

prevSlide.addEventListener('click', () => prewSlides(0));
nextSlide.addEventListener('click', () => nextSlides(0));

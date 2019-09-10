"use strict";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const slides = $$('.slides');
const carLinks = $$('.car-links');
const prevSlide = $('#prev-slide');
const nextSlide = $('#next-slide');

let slideIndex = 1;
showSlides(slideIndex);

function nextSlides() {
  showSlides((slideIndex += 1));
}

function currentSlide(index) {
  showSlides(slideIndex = index);
}

function prewSlides() {
  showSlides((slideIndex += -1));
}

function showSlides(index) {
  if (index > slides.length) {
    slideIndex = 1;
  }

  if (index < 1) {
    slideIndex = slides.length;
  }

  slides.forEach(slide => slide.classList.add('hidden'));
  carLinks.forEach(carLink => carLink.classList.remove('car-links_active'));
  slides[slideIndex - 1].classList.remove('hidden');
  carLinks[slideIndex - 1].classList.add('car-links_active');
  carLinks[slideIndex - 1].removeEventListener('click', currentSlide)
}

prevSlide.addEventListener('click', prewSlides);
nextSlide.addEventListener('click', nextSlides);
carLinks.forEach((carLink, index) => carLink.addEventListener('click', () => currentSlide(index + 1)));

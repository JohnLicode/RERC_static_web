const carousel = document.querySelector('.carousel-container');
const slides = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 0;

function showSlide(n) {
    index = (n + slides.length) % slides.length;
    carousel.style.transform = `translateX(${-index * 100}%)`;
}

prevBtn.addEventListener('click', () => showSlide(index - 1));
nextBtn.addEventListener('click', () => showSlide(index + 1));

// Optional auto-play
setInterval(() => showSlide(index + 1), 4000);
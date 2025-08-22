// class Slider {
//   slider;
//   card;
//   prevBtn;
//   nextBtn;

//   constructor(slider, card, prev, next) {
//     this.slider = document.querySelector(slider);
//     this.cards = document.querySelectorAll(card);
//     this.prevBtn = document.querySelector(prev);
//     this.nextBtn = document.querySelector(next);
//   }
// }

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.participants__list');
  const cards = document.querySelectorAll('.participants__card');
  const prevBtn = document.querySelector('.participants__prev');
  const nextBtn = document.querySelector('.participants__next');

  // Делаем копии карточек сзади и спереди
  const firstClone = cards[0].cloneNode(true);
  const secondClone = cards[1].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);
  const secondLastClone = cards[cards.length - 2].cloneNode(true);

  slider.appendChild(firstClone);
  slider.appendChild(secondClone);
  slider.insertBefore(secondLastClone, cards[0]);
  slider.insertBefore(lastClone, cards[0]);

  const allCards = document.querySelectorAll('.participants__card');
  let cardWidth = allCards[0].offsetWidth; // Получаем ширину карточки

  let currentPosition = 2;            // Текущая позиция
  let isTransitioning = false;        // Показывает происходит ли анимация
  let autoSlideInterval;              // Время автоматического перелистывания

  // Устанавливаем начальную позицию
  slider.style.transform = `translateX(-${currentPosition * cardWidth}px)`;

  // Функция для перехода к следующему слайду
  function nextSlide() {
      if (isTransitioning) return;
      
      isTransitioning = true;
      currentPosition++;
      slider.style.transition = 'transform 0.5s ease';
      slider.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
      
      // После завершения анимации
      console.log('currentPosition', currentPosition)
      setTimeout(() => {
          // Если достигли конца клонов, переходим к началу
          if (currentPosition >= allCards.length - 3) {
              slider.style.transition = 'none';
              currentPosition = 1;
              slider.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
          }
          isTransitioning = false;
      }, 500);
  }

  // Функция для перехода к предыдущему слайду
  function prevSlide() {
      if (isTransitioning) return;
      
      isTransitioning = true;
      currentPosition--;
      slider.style.transition = 'transform 0.5s ease';
      slider.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
      
      // После завершения анимации
      console.log('currentPositionDo', currentPosition)
      setTimeout(() => {
          // Если достигли начала клонов, переходим к концу
          if (currentPosition <= 0) {
              slider.style.transition = 'none';
              currentPosition = allCards.length - 4;
              slider.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
          }
          isTransitioning = false;
          
          console.log('currentPositionPosle', currentPosition)
      }, 500);
  }

  // Обработчики для кнопок
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  window.addEventListener('resize', function() {
    slider.style.transition = '';
    cardWidth = allCards[0].offsetWidth;
    slider.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
    this.setTimeout(() => {
      slider.style.transition = 'transform 0.5s ease';
    }, 500)
  })
})
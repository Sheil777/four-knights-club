class Slider {
  slider;                      // слайдер
  cards;                       // карточки
  prevBtn;                     // кнопка назад
  nextBtn;                     // кнопка вперед
  cardWidth;                   // ширина карточки
  currentPosition = 2;         // Текущая позиция
  currentCard = 3;             // Текущая карточка для вывода на экран
  currentCardEl;               // Элемент для вывода текущего номера
  isTransitioning = false;     // Показывает происходит ли анимация
  autoSlideInterval;           // Здесь будет лежать setInterval для автоматического перелистывания
  allCards;                    // Здесь лежат все карточки вместе с копиями
  loop;                        // Циклическая прокрутка слайдов
  countClicks;                 // Количество возможных кликов
  dots;
  gap;

  constructor({slider, cards, prev, next, counter, currentCard, currentCardEl, autoSlide = false, loop = true, countClicks, dots = false, gap = 0}) {
    this.slider = document.querySelector(slider);
    this.cards = document.querySelectorAll(cards);
    this.prevBtn = document.querySelector(prev);
    this.nextBtn = document.querySelector(next);
    this.loop = loop;
    this.dots = dots;
    this.gap = gap;

    if(countClicks != undefined) {
      this.countClicks = countClicks
    }else{
      this.countClicks = this.cards.length
    }

    if(currentCardEl != undefined)
      this.currentCardEl = document.querySelector(currentCardEl);
    
    // Выводим кол-во слайдов в счётчик
    if(counter != undefined)
      document.querySelector(counter).textContent = this.cards.length

    if(currentCard != undefined) {
      this.currentCard = currentCard
      this.currentPosition = currentCard - 1
      
      if(this.currentCardEl != undefined)
        this.currentCardEl.textContent = this.currentCard
    }

    if(loop) this.cloneCards()                              // Клонируем картоки вперед и назад
    this.allCards = document.querySelectorAll(cards);

    this.cardWidth = this.cards[0].offsetWidth + this.gap;             // Получаем ширину карточки + отступ

    this.slider.style.transform = `translateX(-${this.currentPosition * this.cardWidth}px)`;  // Устанавливаем начальную позицию
    
    // Обработчики для кнопок
    this.nextBtn.addEventListener('click', this.nextSlide);
    this.prevBtn.addEventListener('click', this.prevSlide);

    if(autoSlide) {
      const participants = document.querySelector('.participants__container'); // Весь контейнер, что при наведении отключать автопрокрутку
      
      this.startAutoSlide() // Запускаем автоматическую прокрутку

      // Остановка автоматического переключения при наведении мыши
      participants.addEventListener('mouseenter', () => {
          clearInterval(this.autoSlideInterval);
      });
  
      // Возобновление автоматического переключения при уходе мыши
      participants.addEventListener('mouseleave', this.startAutoSlide);
    }

    this.resizeSlider()

    if(dots) {
      this.createDots()
    }
  }

  // Подстройка слайдера при динамическом изменении размера экрана
  resizeSlider = () => {
    window.addEventListener('resize',() => {
      this.slider.style.transition = '';
      this.cardWidth = this.allCards[0].offsetWidth + this.gap;
      this.slider.style.transform = `translateX(-${this.currentPosition * this.cardWidth}px)`;
      
      setTimeout(() => {
        this.slider.style.transition = 'transform 0.5s ease';
      }, 500)
    })
  }

  // Метод делает копии карточек сзади и спереди
  cloneCards() {
    const firstClone = this.cards[0].cloneNode(true);
    const secondClone = this.cards[1].cloneNode(true);
    const lastClone = this.cards[this.cards.length - 1].cloneNode(true);
    const secondLastClone = this.cards[this.cards.length - 2].cloneNode(true);

    this.slider.appendChild(firstClone);
    this.slider.appendChild(secondClone);
    this.slider.insertBefore(secondLastClone, this.cards[0]);
    this.slider.insertBefore(lastClone, this.cards[0]);
  }

  // Метод для перехода к следующему слайду
  nextSlide = () => {
      if (this.isTransitioning) return;

      if (this.loop === false){
        // Если дошли до конца
        if(this.currentCard >= this.countClicks) {
          return
        }
      }
      
      this.isTransitioning = true;        // Блокируем нажатие на некоторое время
      this.currentPosition++;
      this.slider.style.transition = 'transform 0.5s ease';
      this.slider.style.transform = `translateX(-${this.currentPosition * this.cardWidth}px)`;
      this.changeCurrentCard(1)
      
      // После завершения анимации
      setTimeout(() => {
          // Если достигли конца клонов, переходим к началу
          if (this.currentPosition >= this.allCards.length - 3 && this.loop) {
              this.slider.style.transition = 'none';
              this.currentPosition = 1;
              this.slider.style.transform = `translateX(-${this.currentPosition * this.cardWidth}px)`;
          }
          this.isTransitioning = false;
      }, 500);

      if (this.loop === false){
        this.prevBtn.classList.remove("disabled")
        if(this.currentCard >= this.countClicks) this.nextBtn.classList.add("disabled")
      }

      this.changeDots()
  }

  // Метод для перехода к предыдущему слайду
  prevSlide = () => {
      if (this.isTransitioning) return;

      if (this.loop === false){
        // Если дошли до начала
        if(this.currentCard <= 1) {
          return
        }
      }

      this.isTransitioning = true;
      this.currentPosition--;
      this.slider.style.transition = 'transform 0.5s ease';
      this.slider.style.transform = `translateX(-${this.currentPosition * this.cardWidth}px)`;
      this.changeCurrentCard(-1)
      
      // После завершения анимации
      setTimeout(() => {
          // Если достигли начала клонов, переходим к концу
          if (this.currentPosition <= 0 && this.loop) {
              this.slider.style.transition = 'none';
              this.currentPosition = this.allCards.length - 4;
              this.slider.style.transform = `translateX(-${this.currentPosition * this.cardWidth}px)`;
          }
          this.isTransitioning = false;
          
      }, 500);

      if (this.loop === false){
        this.nextBtn.classList.remove("disabled")
        if(this.currentCard <= 1) this.prevBtn.classList.add("disabled")
      }

      this.changeDots()
  }

  // Метод для изменения счётчика слайдов на экране
  changeCurrentCard(value) {
    this.currentCard += value

    if(this.currentCard > this.cards.length) this.currentCard = 1
    if(this.currentCard < 1) this.currentCard = this.cards.length
    
    if(this.currentCardEl != undefined)
      this.currentCardEl.textContent = this.currentCard
  }

  // Метод автоматического переключения слайдов
  startAutoSlide = () => {
    this.autoSlideInterval = setInterval(this.nextSlide, 4000);
  }

  // Создание точек для перехода
  createDots = () => {
    // Удаляем старые точки
    let dotsRemove = document.querySelectorAll('.story__dot')
    for(let dot of dotsRemove)
      dot.remove()

    // Создаем новые
    const dotsEl = document.querySelector('.story__dots')

    for(let i = 0; i < this.countClicks; i++){
      const dot = document.createElement('div')
      dot.classList.add('story__dot')
      if(i == 0) dot.classList.add('active')
      dotsEl.appendChild(dot)
    }
  }

  // Перещёлкивание точек
  changeDots = () => {
    if(this.dots) {
      let dots = document.querySelectorAll('.story__dot')
      for(let i = 0; i < dots.length; i++) {
        let dot = dots[i]
        dot.classList.remove('active')
        if(i == this.currentCard - 1) dot.classList.add('active')
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Слайдер участников турнира
  new Slider({
    slider: '.participants__list',
    cards: '.participants__card',
    prev: '.participants__prev',
    next: '.participants__next',
    counter: '.participants-count__total',
    currentCard: 3,
    currentCardEl: '.participants-count__current',
    autoSlide: true,
  })

  let width = window.innerWidth
  let SliderStory

  // Слайдер "Этапы преображения Васюков"
  if(width > 1050) {
    SliderStory = new Slider({
      slider: '.story__stages',
      cards: '.story__stages li',
      prev: '.story__prev',
      next: '.story__next',
      loop: false,
      currentCard: 1,
      countClicks: 3,
      dots: true,
      gap: 20,
    })
  }else if(width > 750) {
    SliderStory = new Slider({
      slider: '.story__stages',
      cards: '.story__stages li',
      prev: '.story__prev',
      next: '.story__next',
      loop: false,
      currentCard: 1,
      countClicks: 4,
      dots: true,
      gap: 20,
    })
  }else if(width < 750) {
    SliderStory = new Slider({
      slider: '.story__stages',
      cards: '.story__stages li',
      prev: '.story__prev',
      next: '.story__next',
      loop: false,
      currentCard: 1,
      countClicks: 5,
      dots: true,
      gap: 20,
    })
  }
})
/*

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.participants__list');
  const cards = document.querySelectorAll('.participants__card');
  const prevBtn = document.querySelector('.participants__prev');
  const nextBtn = document.querySelector('.participants__next');

  // Выводим кол-во слайдов в счётчик
  document.querySelector('.participants-count__total').textContent = cards.length

  // Делаем копии карточек сзади и спереди
  const firstClone = cards[0].cloneNode(true);
  const secondClone = cards[1].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);
  const secondLastClone = cards[cards.length - 2].cloneNode(true);
  const participants = document.querySelector('.participants__container'); // Весь контейнер, что при наведении отключать автопрокрутку

  slider.appendChild(firstClone);
  slider.appendChild(secondClone);
  slider.insertBefore(secondLastClone, cards[0]);
  slider.insertBefore(lastClone, cards[0]);

  const allCards = document.querySelectorAll('.participants__card');
  let cardWidth = allCards[0].offsetWidth; // Получаем ширину карточки

  let currentPosition = 2;            // Текущая позиция
  let currentCard = 3;                // Текущая карточка для вывода на экран
  let isTransitioning = false;        // Показывает происходит ли анимация
  let autoSlideInterval;              // Здесь будет лежать setInterval для автоматического перелистывания

  // Устанавливаем начальную позицию
  slider.style.transform = `translateX(-${currentPosition * cardWidth}px)`;

  // Функция для перехода к следующему слайду
  function nextSlide() {
      if (isTransitioning) return;
      
      isTransitioning = true;
      currentPosition++;
      slider.style.transition = 'transform 0.5s ease';
      slider.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
      changeCurrentCard(1)
      
      // После завершения анимации
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
      changeCurrentCard(-1)
      
      // После завершения анимации
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

  // Функция для изменения счётчика слайдов на экране
  function changeCurrentCard(value) {
    currentCard += value

    if(currentCard > cards.length) currentCard = 1
    if(currentCard < 1) currentCard = cards.length

    document.querySelector('.participants-count__current').textContent = currentCard
  }

  // Обработчики для кнопок
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Подстройка слайдера при динамическом изменении размера экрана
  window.addEventListener('resize', function() {
    slider.style.transition = '';
    cardWidth = allCards[0].offsetWidth;
    slider.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
    this.setTimeout(() => {
      slider.style.transition = 'transform 0.5s ease';
    }, 500)
  })

  // Автоматическое переключение слайдов
  function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 4000);
  }
  
  // Остановка автоматического переключения при наведении мыши
  participants.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
  });
  
  // Возобновление автоматического переключения при уходе мыши
  participants.addEventListener('mouseleave', startAutoSlide);
  
  // Запускаем автоматическое переключение
  startAutoSlide();

})

*/
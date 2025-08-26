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
  let width = window.innerWidth

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


  // Слайдер "Этапы преображения Васюков"
  if(width > 1050) {
    new Slider({
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
    new Slider({
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
    new Slider({
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

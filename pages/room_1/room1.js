document.addEventListener('DOMContentLoaded', () => {
    // 1. Получаем элементы
    const slidesContainer = document.getElementById('slides');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.nav--prev');
    const nextBtn = document.querySelector('.nav--next');
    const sliderFrame = document.getElementById('slider'); // Рамка для свайпов

    let currentIndex = 0;
    const totalSlides = slides.length;

    // 2. Функция переключения слайдов
    function updateSlider() {
        // Сдвигаем ленту на нужный процент
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function go(direction) {
        // direction: 1 = вперед, -1 = назад
        currentIndex += direction;

        // Зацикливание (карусель)
        if (currentIndex >= totalSlides) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = totalSlides - 1;
        }

        updateSlider();
    }

    // 3. Обработчики кнопок (Стрелок)
    if (nextBtn) nextBtn.addEventListener('click', () => go(1));
    if (prevBtn) prevBtn.addEventListener('click', () => go(-1));

    // 4. Управление с клавиатуры
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
    });

    // 5. Свайпы (Взято из вашего кода, но адаптировано)
    // Pointer events работают и для мышки, и для пальца
    let startX = null;

    sliderFrame.addEventListener('pointerdown', e => {
        // Блокируем стандартное перетаскивание картинки браузером
        e.preventDefault(); 
        startX = e.clientX;
        // Захват курсора для лучшего UX
        sliderFrame.setPointerCapture(e.pointerId);
    });

    sliderFrame.addEventListener('pointerup', e => {
        if (startX === null) return;
        
        const endX = e.clientX;
        const diff = startX - endX;
        const minSwipeDistance = 50; // Минимальная длина свайпа

        // Если провели пальцем влево (больше порога) -> следующий слайд
        if (diff > minSwipeDistance) {
            go(1);
        } 
        // Если провели вправо -> предыдущий слайд
        else if (diff < -minSwipeDistance) {
            go(-1);
        }

        startX = null;
        sliderFrame.releasePointerCapture(e.pointerId);
    });
    
    // Сбрасываем свайп, если курсор ушел за пределы или отменился
    sliderFrame.addEventListener('pointercancel', () => {
        startX = null;
    });
});
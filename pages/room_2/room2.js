const slides = [
  {
    title: "",
    meta: [
      "Гості: до 3 осіб",
      "Другий поверх",
      "Оснащення: балкон, вікно‑ліжко, <br/> велика спільна кухня з зоною відпочинку."
    ],
    ctaText: "Бронювати",
    ctaHref: "https://booking-117473.otelms.com/booking/rooms",
    // три изображения для “стопки” (можно оставить одно — остальные убрать)
    images: [
      "../../images/rooms/room_2/room_2-1.jpg"
    ]
  },
  {
    title: "Room #2",
    meta: ["Гості: до 4 осіб", "Перший поверх", "Оснащення: тераса, панорамні вікна."],
    ctaText: "Бронювати",
    ctaHref: "https://booking-117473.otelms.com/booking/rooms",
    images: ["../../images/rooms/room_2/room_2-2.jpg"]
  },
  {
    title: "Room #3",
    meta: ["Гості: до 2 осіб", "Другий поверх", "Оснащення: вид на гори, зручне робоче місце."],
    ctaText: "Бронювати",
    ctaHref: "https://booking-117473.otelms.com/booking/rooms",
    images: ["../../images/rooms/room_2/room_2-3.jpg"]
  },
  {
    title: "Room #3",
    meta: ["Гості: до 2 осіб", "Другий поверх", "Оснащення: вид на гори, зручне робоче місце."],
    ctaText: "Бронювати",
    ctaHref: "https://booking-117473.otelms.com/booking/rooms",
    images: ["../../images/rooms/room_2/room_2-4.jpg"]
  },
  {
    title: "Room #3",
    meta: ["Гості: до 2 осіб", "Другий поверх", "Оснащення: вид на гори, зручне робоче місце."],
    ctaText: "Бронювати",
    ctaHref: "https://booking-117473.otelms.com/booking/rooms",
    images: ["../../images/rooms/room_2/room_2-5.jpg"]
  },
];

const track = document.querySelector(".room-slider__track");
const dotsWrap = document.querySelector(".room-slider__dots");
const btnPrev = document.querySelector(".room-slider__arrow--prev");
const btnNext = document.querySelector(".room-slider__arrow--next");

function slideMarkup(s){
  const [main, mid, back] = s.images;
  const meta = s.meta.map(m=>`<div>${m}</div>`).join("");
  return `
    <article class="room-slide">
      <div class="room-slide__media">
        ${back ? `<img class="room-slide__img room-slide__img--back" src="${back}" alt="">` : ""}
        ${mid ? `<img class="room-slide__img room-slide__img--mid" src="${mid}" alt="">` : ""}
        <img class="room-slide__img" src="${main}" alt="${s.title}">
      </div>
      <div class="room-slide__content">
        <div class="room-slide__meta">${meta}</div>
      </div>
    </article>
  `;
}

function render(){
  track.innerHTML = slides.map(slideMarkup).join("");
  dotsWrap.innerHTML = slides.map((_,i)=>`<button class="room-slider__dot" data-i="${i}" aria-label="Go to ${i+1}"></button>`).join("");
}
render();

const dots = Array.from(dotsWrap.children);
let index = 0;
function go(i){
  index = (i+slides.length) % slides.length;
  track.style.transform = `translateX(-${index*100}%)`;
  dots.forEach((d,di)=>d.classList.toggle("is-active", di===index));
}
go(0);

btnPrev.addEventListener("click", ()=>go(index-1));
btnNext.addEventListener("click", ()=>go(index+1));
dotsWrap.addEventListener("click", e=>{
  const b = e.target.closest(".room-slider__dot");
  if(!b) return;
  go(+b.dataset.i);
});

/* Клавиатура */
window.addEventListener("keydown", e=>{
  if(e.key === "ArrowLeft") go(index-1);
  if(e.key === "ArrowRight") go(index+1);
});

/* Свайпы (тач) */
let startX = 0, isTouch=false;
track.addEventListener("touchstart", e=>{ isTouch=true; startX = e.touches[0].clientX; }, {passive:true});
track.addEventListener("touchmove", e=>{
  if(!isTouch) return;
  const dx = e.touches[0].clientX - startX;
  if(Math.abs(dx) > 50){ go(index + (dx<0?1:-1)); isTouch=false; }
}, {passive:true});
track.addEventListener("touchend", ()=>{ isTouch=false; });

/* Автоподгон высоты (если контент разной высоты) — по желанию
   Можно добавить: .room-slider { height: auto } — тут всё флюидно
*/

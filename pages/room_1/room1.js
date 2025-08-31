// ===== helpers =====
const byId = id => document.getElementById(id);
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// ===== DOM =====
const $slidesWrap = byId('slides');
const $dotsWrap   = byId('dots');
const $slider     = byId('slider');
const $slides     = qsa('.slide', $slidesWrap);
const N = $slides.length;
let index = 0;

// ===== контент из data-*, заголовок как ссылка при наличии data-link
function hydrateSlides() {
  $slides.forEach(sl => {
    const title = sl.dataset.title || '';
    const text  = sl.dataset.text  || '';
    const link  = sl.dataset.link  || '';

    const $h1  = qs('.h1', sl);
    const $p   = qs('.p', sl);
    const $btn = qs('.btn', sl);

    if (title) {
      $h1.innerHTML = link
        ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>`
        : title;
    } else {
      $h1.textContent = '';
    }
    $p.textContent = text;

    if ($btn) {
      if (link) {
        $btn.hidden = false;
        $btn.onclick = () => location.href = link;
      } else {
        $btn.hidden = true;
        $btn.onclick = null;
      }
    }
  });
}

// ===== точки
function buildDots() {
  $dotsWrap.innerHTML = '';
  for (let i = 0; i < N; i++) {
    const b = document.createElement('button');
    b.className = 'dot';
    b.type = 'button';
    b.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    $dotsWrap.appendChild(b);
  }
}

function paint() {
  // проматываем ленту
  $slidesWrap.style.transform = `translateX(${-index * 100}%)`;
  // обновляем точки
  qsa('.dot', $dotsWrap).forEach((d, i) => {
    d.classList.toggle('is-active', i === index);
  });
}

function goTo(i) {
  index = clamp(i, 0, N - 1);
  paint();
}

function go(delta) {
  index = (index + delta + N) % N;
  paint();
}

// ===== стрелки
qs('[data-dir="prev"]').addEventListener('click', () => go(-1));
qs('[data-dir="next"]').addEventListener('click', () => go(+1));

// ===== клавиатура
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  go(-1);
  if (e.key === 'ArrowRight') go(+1);
});

// ===== свайпы (pointer events)
let startX = null;
$slider.addEventListener('pointerdown', e => {
  startX = e.clientX;
});
$slider.addEventListener('pointerup', e => {
  if (startX == null) return;
  const dx = e.clientX - startX;
  startX = null;
  if (Math.abs(dx) > 50) go(dx > 0 ? -1 : +1);
});

// ===== init =====
hydrateSlides();
buildDots();
goTo(0);

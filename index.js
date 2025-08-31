// ===== helpers =====
const byId = id => document.getElementById(id);
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const mod = (i, m) => (i % m + m) % m;

// ===== DOM =====
const $stack  = byId('stack');
const $slides = qsa('.slide', $stack);
const N = $slides.length;
let index = 0;

// Создаёт/обновляет <a> внутри заголовка .h1
function setTitleAsLink($h1, text, href) {
  if (!text) {
    $h1.textContent = '';
    return;
  }
  if (href) {
    // открытие в новой вкладке; убери target, если нужно в этой же вкладке
    $h1.innerHTML =
      `<a class="slide__title-link" href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  } else {
    $h1.textContent = text;
  }
}

// Инициализация контента из data-атрибутов
function hydrateSlides() {
  $slides.forEach(sl => {
    const title = sl.dataset.title || '';
    const text  = sl.dataset.text  || '';
    const link  = sl.dataset.link  || '';
    const booking  = sl.dataset.booking  || '';

    const $h1  = qs('.h1', sl);
    const $p   = qs('.p', sl);
    const $btn = qs('.btn', sl);

    setTitleAsLink($h1, title, link);
    if ($p) $p.textContent = text;

    if ($btn) {
      if (link) {
        $btn.hidden = false;
        $btn.onclick = () => window.open(booking, '_blank');
      } else {
        $btn.hidden = true;
        $btn.onclick = null;
      }
    }
  });
}

// Управление классами видимости
function applyClasses() {
  $slides.forEach(sl => sl.className = 'slide is-hidden');

  const left  = $slides[mod(index - 1, N)];
  const curr  = $slides[index];
  const right = $slides[mod(index + 1, N)];

  left.classList.add('is-left');     left.classList.remove('is-hidden');
  curr.classList.add('is-current');  curr.classList.remove('is-hidden');
  right.classList.add('is-right');   right.classList.remove('is-hidden');
}

function go(dir = 1) {
  if (!N) return;
  index = mod(index + dir, N);
  applyClasses();
}

// ===== навигация кнопками =====
const $prev = document.querySelector('[data-dir="prev"]');
const $next = document.querySelector('[data-dir="next"]');
$prev && $prev.addEventListener('click', () => go(-1));
$next && $next.addEventListener('click', () => go(+1));

// ===== клавиатура =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  go(-1);
  if (e.key === 'ArrowRight') go(+1);
});

// ===== свайпы (pointer) =====
let startX = null;
$stack.addEventListener('pointerdown', (e) => {
  startX = e.clientX;
});
$stack.addEventListener('pointerup', (e) => {
  if (startX == null) return;
  const dx = e.clientX - startX;
  startX = null;
  if (Math.abs(dx) > 50) go(dx > 0 ? -1 : +1);
});

// ===== init =====
hydrateSlides();
applyClasses();

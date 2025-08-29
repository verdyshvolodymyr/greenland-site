const byId = id => document.getElementById(id);
const $stack = byId('stack');
const $slides = Array.from($stack.querySelectorAll('.slide'));
const N = $slides.length;
let index = 0;

// заполнить тексты из data-*
$slides.forEach(sl => {
  const t = sl.dataset.title || '';
  const txt = sl.dataset.text || '';
  sl.querySelector('.h1').textContent = t;
  sl.querySelector('.p').textContent = txt;
  const link = sl.dataset.link;
  if (link) sl.querySelector('.btn').onclick = () => location.href = link;
});

function mod(i, m){ return (i % m + m) % m; }

function applyClasses() {
  // Сбрасываем
  $slides.forEach(sl => sl.className = 'slide is-hidden');

  // Три видимых слоя: левый(размытый), текущий, правый(размытый)
  const left  = $slides[mod(index-1, N)];
  const curr  = $slides[index];
  const right = $slides[mod(index+1, N)];

  left.classList.add('is-left');  left.classList.remove('is-hidden');
  curr.classList.add('is-current'); curr.classList.remove('is-hidden');
  right.classList.add('is-right'); right.classList.remove('is-hidden');
}

function go(dir=1){
  index = mod(index + dir, N);
  applyClasses();
}

// навигация
document.querySelector('[data-dir="prev"]').addEventListener('click', () => go(-1));
document.querySelector('[data-dir="next"]').addEventListener('click', () => go(+1));

// свайпы на мобильном
let startX = 0;
$stack.addEventListener('pointerdown', e => startX = e.clientX);
$stack.addEventListener('pointerup',   e => {
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 50) {
    go(dx > 0 ? -1 : +1);
  }
});

// init
applyClasses();

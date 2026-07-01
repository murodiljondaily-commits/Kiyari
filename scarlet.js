(() => {
  const layer = document.querySelector('#ambientWorld');
  if (!layer) return;
  const colors = ['#ff1748', '#ff315d', '#ff5a78', '#f00042'];
  const flower = '<svg viewBox="0 0 32 32"><path class="heart-petal" d="M16 14C8 11 7 3 12 2c3-.7 4 2 4 4 0-2 1-4.7 4-4 5 1 4 9-4 12Z"/><path class="heart-petal" d="M18 16c3-8 11-9 12-4 .7 3-2 4-4 4 2 0 4.7 1 4 4-1 5-9 4-12-4Z"/><path class="heart-petal" d="M16 18c8 3 9 11 4 12-3 .7-4-2-4-4 0 2-1 4.7-4 4-5-1-4-9 4-12Z"/><path class="heart-petal" d="M14 16c-3 8-11 9-12 4-.7-3 2-4 4-4-2 0-4.7-1-4-4 1-5 9-4 12 4Z"/><circle class="flower-core" cx="16" cy="16" r="3.2"/></svg>';
  for (let i = 0; i < 14; i++) {
    const bloom = document.createElement('span');
    bloom.className = 'ambient-flower scarlet-bloom';
    bloom.innerHTML = flower;
    bloom.style.cssText = `--x:${Math.random() * 100}%;--y:${Math.random() * 100}%;--flower-size:${10 + Math.random() * 13}px;--flower-color:${colors[i % colors.length]};--flower-opacity:${.56 + Math.random() * .27};--delay:${-Math.random() * 18}s;--duration:${11 + Math.random() * 12}s;--drift-x:${-42 + Math.random() * 84}px`;
    layer.append(bloom);
  }
})();

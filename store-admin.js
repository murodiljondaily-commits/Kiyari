(() => {
  const safe = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const descriptionOf = product => typeof product.description === 'object' ? (product.description[lang] || product.description.uz || '') : (product.description || '');

  card = product => {
    const saved = favorites.includes(product.id);
    const calculatedDiscount = product.oldPrice > product.price ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
    const discount = Number(product.discount) || calculatedDiscount;
    const badges = `${product.isNew ? '<span class="badge">NEW</span>' : ''}${discount ? `<span class="badge discount-badge">−${discount}%</span>` : ''}`;
    return `<article class="product-card"><div class="product-image"><img loading="lazy" src="${safe(product.image)}" alt="${safe(productName(product))}"><div class="card-badges">${badges}</div><button class="favorite ${saved ? 'active' : ''}" data-favorite="${safe(product.id)}" aria-label="Favorite">${saved ? '♥' : '♡'}</button></div><div class="product-info"><h3>${safe(productName(product))}</h3>${descriptionOf(product) ? `<p class="product-description">${safe(descriptionOf(product))}</p>` : ''}<div class="price-row"><span class="price">${money(product.price)}</span>${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ''}</div><p class="meta">${product.sizes?.map(safe).join(' · ') || 'ONE SIZE'} · ${product.stock || 0} IN STOCK</p><a class="telegram-product" target="_blank" rel="noreferrer" href="https://t.me/KIYARI_UZ">TELEGRAM ↗</a></div></article>`;
  };

  const copy = {
    uz: { trend: 'Trenddagi liboslar', trendSub: 'Hozir eng ko‘p e’tibor tortayotgan uslublar', kids: 'Kids kolleksiya', kidsSub: 'Kichik malikalar uchun nafis tanlov', empty: 'Bu bo‘limga mahsulotlar tez orada qo‘shiladi' },
    ru: { trend: 'В тренде', trendSub: 'Образы, которые сейчас привлекают внимание', kids: 'Детская коллекция', kidsSub: 'Нежный выбор для маленьких принцесс', empty: 'Товары скоро появятся в этом разделе' },
    en: { trend: 'Trending Styles', trendSub: 'Looks getting the most attention right now', kids: 'Kids Collection', kidsSub: 'Elegant choices for little princesses', empty: 'Products will appear here soon' }
  };

  const renderExtraCollections = () => {
    const words = copy[lang] || copy.uz;
    document.querySelector('#trendingTitle').textContent = words.trend;
    document.querySelector('#trendingSubtitle').textContent = words.trendSub;
    document.querySelector('#kidsTitle').textContent = words.kids;
    document.querySelector('#kidsSubtitle').textContent = words.kidsSub;
    const trendItems = products.filter(product => product.trending);
    const kidsItems = products.filter(product => product.kids || product.category === 'kids');
    document.querySelector('#trendingGrid').innerHTML = trendItems.length ? trendItems.map(card).join('') : `<div class="empty"><b>✦</b>${words.empty}</div>`;
    document.querySelector('#kidsGrid').innerHTML = kidsItems.length ? kidsItems.map(card).join('') : `<div class="empty"><b>♡</b>${words.empty}</div>`;
  };

  const originalDraw = draw;
  draw = () => { originalDraw(); renderExtraCollections(); };

  drawAdmin = () => {
    const list = document.querySelector('#adminProducts');
    if (!list) return;
    list.innerHTML = '<h3>Joylangan mahsulotlar</h3>' + products.map(product => `<div class="admin-item"><span><b>${safe(productName(product))}</b><small>${money(product.price)}</small></span><span><button type="button" data-edit="${safe(product.id)}">Tahrirlash</button><button type="button" data-delete="${safe(product.id)}">O‘chirish</button></span></div>`).join('');
    list.querySelectorAll('[data-delete]').forEach(button => button.onclick = () => {
      products = products.filter(product => product.id !== button.dataset.delete);
      favorites = favorites.filter(id => id !== button.dataset.delete);
      persist(); draw();
    });
    list.querySelectorAll('[data-edit]').forEach(button => button.onclick = () => {
      const product = products.find(item => item.id === button.dataset.edit);
      ['id', 'category', 'price', 'oldPrice', 'discount', 'stock'].forEach(key => form.elements[key].value = product[key] || '');
      form.elements.name.value = productName(product);
      form.elements.description.value = descriptionOf(product);
      form.elements.sizes.value = product.sizes?.join(',') || '';
      ['popular', 'trending', 'kids', 'isNew'].forEach(key => form.elements[key].checked = Boolean(product[key]));
      form.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  form.onsubmit = async event => {
    event.preventDefault();
    const data = new FormData(form);
    const existing = products.find(product => product.id === data.get('id'));
    const file = data.get('image');
    let image = existing?.image || IMG.pink;
    if (file?.size) image = await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); });
    const product = {
      id: data.get('id') || `p${Date.now()}`,
      name: { uz: data.get('name'), ru: data.get('name'), en: data.get('name') },
      description: { uz: data.get('description'), ru: data.get('description'), en: data.get('description') },
      category: data.get('category'), price: Number(data.get('price')), oldPrice: Number(data.get('oldPrice')) || 0,
      discount: Number(data.get('discount')) || 0, image, sizes: data.get('sizes').split(',').map(size => size.trim()).filter(Boolean),
      stock: Number(data.get('stock')) || 0, popular: data.has('popular'), trending: data.has('trending'), kids: data.has('kids'), isNew: data.has('isNew')
    };
    products = existing ? products.map(item => item.id === product.id ? product : item) : [product, ...products];
    persist(); form.reset(); draw(); toast('Mahsulot barcha tanlangan bo‘limlarga joylandi');
  };

  draw();
})();

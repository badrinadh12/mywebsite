// ── CONFIG ──
const OWNER_PHONE = "916305906221";

// ── STATE ──
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
let activeType  = 'all';
let activePrice = 'all';
let searchQuery = '';

// ── DOM ──
const grid          = document.getElementById('productGrid');
const noResults     = document.getElementById('noResults');
const searchInput   = document.getElementById('searchInput');
const searchClear   = document.getElementById('searchClear');
const resultCount   = document.getElementById('resultCount');
const wishCount     = document.getElementById('wishCount');
const orderOverlay  = document.getElementById('orderOverlay');
const wishOverlay   = document.getElementById('wishlistOverlay');
const zoomOverlay   = document.getElementById('zoomOverlay');
const mainNav       = document.getElementById('mainNav');

// ── PRICE RANGES ──
const priceRanges = {
  'all':           [0, Infinity],
  '0-3000':        [0, 3000],
  '3000-10000':    [3000, 10000],
  '10000-20000':   [10000, 20000],
  '20000-999999':  [20000, Infinity]
};

// ── FILTER LOGIC ──
function getFiltered() {
  const [pMin, pMax] = priceRanges[activePrice];
  return products.filter(p => {
    const typeOk  = activeType === 'all' || p.category.includes(activeType);
    const priceOk = p.priceValue >= pMin && p.priceValue <= pMax;
    const q       = searchQuery.toLowerCase();
    const searchOk = !q ||
      p.name.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.category.some(c => c.includes(q));
    return typeOk && priceOk && searchOk;
  });
}

// ── PLACEHOLDER SVG ──
function placeholderSVG(p) {
  return `<div class="card-placeholder" style="background:${p.color}15;width:100%;height:100%">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="8" y="8" width="48" height="48" rx="3" fill="${p.color}" opacity="0.2"/>
      <path d="M8 32 Q20 16 32 32 Q44 48 56 32" stroke="${p.color}" stroke-width="2.5" fill="none" opacity="0.45"/>
      <circle cx="32" cy="32" r="7" fill="${p.color}" opacity="0.35"/>
    </svg>
    <span style="font-size:0.62rem;letter-spacing:2px;color:${p.color};opacity:0.55;margin-top:4px">Photo coming soon</span>
  </div>`;
}

// ── RENDER GRID ──
function renderCards() {
  const list = getFiltered();
  resultCount.textContent = `${list.length} saree${list.length !== 1 ? 's' : ''} found`;

  if (!list.length) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  grid.innerHTML = list.map(p => {
    const wished   = wishlist.includes(p.id);
    const soldOut  = p.badge === 'Sold Out';
    const imgHtml  = p.img
      ? `<img src="${p.img}" alt="${p.name}" loading="lazy"/>`
      : placeholderSVG(p);

    return `<div class="card" data-id="${p.id}">
      ${p.badge ? `<div class="card-badge ${soldOut ? 'badge-sold' : ''}">${p.badge}</div>` : ''}
      <button class="card-wish ${wished ? 'wished' : ''}" onclick="toggleWish(event,${p.id})" title="${wished ? 'Remove from wishlist' : 'Add to wishlist'}">
        ${wished ? '♥' : '♡'}
      </button>
      <div class="card-img-wrap" onclick="openZoom(${p.id})">
        ${imgHtml}
        <span class="zoom-hint">🔍 View Details</span>
      </div>
      <div class="card-body">
        <div class="card-title" onclick="openZoom(${p.id})">${p.name}</div>
        <div class="card-meta">${p.material}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-footer">
          <div class="card-price">${p.price}</div>
          <button class="buy-btn" onclick="openOrder(${p.id})" ${soldOut ? 'disabled' : ''}>
            ${soldOut ? 'Sold Out' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  updateWishCount();
}

// ── TYPE FILTER ──
document.querySelectorAll('#typeFilters .pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#typeFilters .pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeType = btn.dataset.type;
    renderCards();
  });
});

// ── PRICE FILTER ──
document.querySelectorAll('#priceFilters .pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#priceFilters .pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activePrice = btn.dataset.price;
    renderCards();
  });
});

// ── SEARCH ──
searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  searchClear.classList.toggle('visible', !!searchQuery);
  renderCards();
});
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  searchClear.classList.remove('visible');
  renderCards();
});

// ── CLEAR ALL FILTERS ──
document.getElementById('clearAllFilters').addEventListener('click', () => {
  activeType  = 'all';
  activePrice = 'all';
  searchQuery = '';
  searchInput.value = '';
  searchClear.classList.remove('visible');
  document.querySelectorAll('#typeFilters .pill').forEach((b,i) => b.classList.toggle('active', i===0));
  document.querySelectorAll('#priceFilters .pill').forEach((b,i) => b.classList.toggle('active', i===0));
  renderCards();
});

// ── WISHLIST ──
function toggleWish(e, id) {
  e.stopPropagation();
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
  } else {
    wishlist.push(id);
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  renderCards();
  if (zoomOverlay.classList.contains('open')) {
    const p = products.find(x => x.id === id);
    if (p) updateZoomWishBtn(id);
  }
}

function updateWishCount() {
  wishCount.textContent = wishlist.length;
}

function openWishlist() {
  const items = document.getElementById('wishlistItems');
  const footer = document.getElementById('wishlistFooter');
  const wItems = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);

  if (!wItems.length) {
    items.innerHTML = `<div class="empty-wish">
      <div style="font-size:2rem;margin-bottom:0.5rem">♡</div>
      Your wishlist is empty.<br/>Tap the heart on any saree to save it here.
    </div>`;
    footer.style.display = 'none';
  } else {
    items.innerHTML = wItems.map(p => `
      <div class="wish-item">
        <div class="wish-item-img" style="background:${p.color}22">
          ${p.img ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"/>` : ''}
        </div>
        <div class="wish-item-info">
          <div class="wish-item-name">${p.name}</div>
          <div class="wish-item-price">${p.price}</div>
        </div>
        <button class="wish-item-remove" onclick="toggleWish(event,${p.id});openWishlist()">✕</button>
      </div>`).join('');

    const msg = encodeURIComponent(
      `Hello! I am interested in the following sarees:\n\n` +
      wItems.map(p => `• ${p.name} (${p.price})`).join('\n') +
      `\n\nPlease share more details.`
    );
    document.getElementById('wishlistWaBtn').href = `https://wa.me/${OWNER_PHONE}?text=${msg}`;
    footer.style.display = 'block';
  }

  wishOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

document.getElementById('wishlistNavBtn').addEventListener('click', e => { e.preventDefault(); openWishlist(); });
document.getElementById('wishlistClose').addEventListener('click', () => { wishOverlay.classList.remove('open'); document.body.style.overflow = ''; });
wishOverlay.addEventListener('click', e => { if (e.target === wishOverlay) { wishOverlay.classList.remove('open'); document.body.style.overflow = ''; } });

// ── ZOOM / DETAIL ──
function openZoom(id) {
  const p = products.find(x => x.id === id);

  document.getElementById('zoomTitle').textContent  = p.name;
  document.getElementById('zoomMeta').textContent   = p.material;
  document.getElementById('zoomPrice').textContent  = p.price;
  document.getElementById('zoomDesc').textContent   = p.desc;
  document.getElementById('zoomBadge').textContent  = p.badge || '';

  const tags = p.category.map(c => `<span class="zoom-tag">${c}</span>`).join('');
  document.getElementById('zoomTags').innerHTML = tags;

  const imgWrap = document.getElementById('zoomImgWrap');
  imgWrap.innerHTML = p.img
    ? `<img src="${p.img}" alt="${p.name}"/>`
    : placeholderSVG(p);

  updateZoomWishBtn(id);

  document.getElementById('zoomBuyBtn').onclick    = () => { closeZoom(); openOrder(id); };
  document.getElementById('zoomWishBtn').onclick   = () => { toggleWish({ stopPropagation:()=>{} }, id); updateZoomWishBtn(id); };

  zoomOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateZoomWishBtn(id) {
  const btn = document.getElementById('zoomWishBtn');
  if (!btn) return;
  const wished = wishlist.includes(id);
  btn.textContent = wished ? '♥ Remove from Wishlist' : '♡ Add to Wishlist';
  btn.classList.toggle('wished', wished);
}

function closeZoom() { zoomOverlay.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('zoomClose').addEventListener('click', closeZoom);
zoomOverlay.addEventListener('click', e => { if (e.target === zoomOverlay) closeZoom(); });

// ── ORDER MODAL ──
function openOrder(id) {
  const p = products.find(x => x.id === id);
  document.getElementById('modalSareeName').textContent = `${p.name} — ${p.price}`;
  document.getElementById('modalBotSaree').textContent  = p.name;
  const msg = encodeURIComponent(
    `Hello! I would like to order:\n\n*${p.name}*\n${p.material}\nPrice: *${p.price}*\n\nPlease guide me with the next steps.`
  );
  document.getElementById('waOrderLink').href = `https://wa.me/${OWNER_PHONE}?text=${msg}`;
  orderOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrder() { orderOverlay.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('modalClose').addEventListener('click', closeOrder);
orderOverlay.addEventListener('click', e => { if (e.target === orderOverlay) closeOrder(); });

// ── ESC KEY ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeOrder(); closeZoom(); wishOverlay.classList.remove('open'); document.body.style.overflow = ''; }
});

// ── MOBILE MENU ──
document.getElementById('hamburger').addEventListener('click', () => mainNav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

// ── HEADER SHADOW ──
window.addEventListener('scroll', () => {
  document.getElementById('mainHeader').style.boxShadow = window.scrollY > 10 ? '0 2px 20px #0008' : 'none';
});

// ── INIT ──
renderCards();

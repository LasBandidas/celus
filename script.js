/* =========================================================
   iBITE — script.js  ·  Vanilla JS modular
   Secciones:
     1) DATA (productos, categorías, marcas)
     2) STATE (carrito, wishlist, filtros) + LocalStorage
     3) INIT & Utils (toast, $, format)
     4) RENDER (productos, categorías, marcas, ofertas)
     5) FILTROS + BUSCADOR + ORDEN
     6) CARRITO / WISHLIST / CUENTA (drawers)
     7) QUICK VIEW MODAL
     8) HEADER scroll, menu, cursor, particles, reveal
     9) COUNTDOWN, NEWSLETTER, TO-TOP, LOADER
   ========================================================= */

/* ---------- 1) DATA ---------- */
const CATEGORIES = [
  { id:"fundas", name:"Fundas", icon:"📱" },
  { id:"cargadores", name:"Cargadores", icon:"⚡" },
  { id:"auriculares", name:"Auriculares", icon:"🎧" },
  { id:"powerbank", name:"Power Bank", icon:"🔋" },
  { id:"soportes", name:"Soportes", icon:"🧲" },
  { id:"adaptadores", name:"Adaptadores", icon:"🔌" },
  { id:"smartwatch", name:"Smartwatch", icon:"⌚" },
  { id:"cables", name:"Cables", icon:"🧵" },
];

const BRANDS = ["Apple","Samsung","Motorola","Huawei","JBL"];
const COMPATS = ["iPhone","Samsung","Moto G","Moto Edge","Redmi","Universal"];
const COLORS = [
  { id:"black", name:"Negro", hex:"#111" },
  { id:"white", name:"Blanco", hex:"#eee" },
  { id:"purple", name:"Violeta", hex:"#a855f7" },
  { id:"cyan", name:"Cyan", hex:"#22d3ee" },
  { id:"pink", name:"Rosa", hex:"#ec4899" },
  { id:"blue", name:"Azul", hex:"#3b82f6" },
];

// Imagen placeholder consistente por producto (usa un SVG data-url por categoría)
function svgImage(icon, colorA="#a855f7", colorB="#22d3ee"){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <defs><radialGradient id='g' cx='50%' cy='60%' r='60%'>
      <stop offset='0%' stop-color='${colorA}' stop-opacity='.6'/>
      <stop offset='100%' stop-color='${colorB}' stop-opacity='0'/>
    </radialGradient></defs>
    <circle cx='100' cy='115' r='80' fill='url(#g)'/>
    <text x='50%' y='55%' font-size='90' text-anchor='middle' dominant-baseline='middle'>${icon}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Genero un catálogo grande combinatorio
const PRODUCTS = (() => {
  const items = [];
  let id = 1;
  const templates = [
    { cat:"fundas", icon:"📱", base:"Funda MagSafe", price:9990, brands:["ESR","Spigen","Apple","Baseus"] },
    { cat:"fundas", icon:"📱", base:"Funda Silicona", price:6990, brands:["Samsung","Xiaomi","Motorola"] },
    { cat:"vidrios", icon:"🛡️", base:"Vidrio Templado 9H", price:3990, brands:["ESR","Spigen","Baseus"] },
    { cat:"vidrios", icon:"🛡️", base:"Vidrio Antiespía", price:5990, brands:["ESR","Spigen"] },
    { cat:"cargadores", icon:"⚡", base:"Cargador GaN 65W", price:24990, brands:["Anker","Ugreen","Baseus"] },
    { cat:"cargadores", icon:"⚡", base:"Cargador Inalámbrico 15W", price:15990, brands:["Anker","Baseus","Apple"] },
    { cat:"auriculares", icon:"🎧", base:"Auriculares TWS Pro", price:39990, brands:["JBL","Apple","Samsung","Xiaomi"] },
    { cat:"auriculares", icon:"🎧", base:"Auriculares Gaming RGB", price:29990, brands:["JBL","Anker"] },
    { cat:"powerbank", icon:"🔋", base:"Power Bank 20.000mAh", price:34990, brands:["Anker","Xiaomi","Baseus"] },
    { cat:"powerbank", icon:"🔋", base:"Power Bank MagSafe 10K", price:29990, brands:["Anker","ESR","Baseus"] },
    { cat:"soportes", icon:"🧲", base:"Soporte MagSafe Auto", price:12990, brands:["Baseus","ESR","Ugreen"] },
    { cat:"soportes", icon:"🧲", base:"Soporte Aluminio Desk", price:9990, brands:["Ugreen","Baseus"] },
    { cat:"adaptadores", icon:"🔌", base:"Hub USB-C 7 en 1", price:22990, brands:["Ugreen","Anker","Baseus"] },
    { cat:"adaptadores", icon:"🔌", base:"Adaptador Jack 3.5", price:4990, brands:["Ugreen","Apple"] },
    { cat:"smartwatch", icon:"⌚", base:"Smartwatch Pro GPS", price:79990, brands:["Apple","Samsung","Xiaomi","Huawei"] },
    { cat:"smartwatch", icon:"⌚", base:"Malla Deportiva", price:5990, brands:["Apple","Spigen","ESR"] },
    { cat:"cables", icon:"🧵", base:"Cable USB-C 100W", price:6990, brands:["Ugreen","Anker","Baseus"] },
    { cat:"cables", icon:"🧵", base:"Cable Lightning MFi", price:8990, brands:["Anker","Apple","Ugreen"] },
  ];
  const palettes = [["#a855f7","#22d3ee"],["#ec4899","#7c3aed"],["#3b82f6","#22d3ee"],["#ec4899","#a855f7"]];
  templates.forEach(t => {
    t.brands.forEach(b => {
      COMPATS.slice(0, 3).forEach((comp, i) => {
        const color = COLORS[(id) % COLORS.length];
        const pal = palettes[id % palettes.length];
        const price = t.price + Math.round(((id*137)%50 - 25)*100);
        const hasOffer = id % 3 === 0;
        const oldPrice = hasOffer ? Math.round(price*1.25) : null;
        items.push({
          id: id++,
          name: `${t.base} — ${b}`,
          brand: b,
          category: t.cat,
          compat: comp,
          color: color.id,
          colorHex: color.hex,
          price,
          oldPrice,
          discount: hasOffer ? Math.round((1 - price/oldPrice)*100) : 0,
          stock: (id % 7 === 0) ? 0 : (5 + (id % 30)),
          rating: 3 + ((id*7) % 20)/10, // 3.0 - 5.0
          reviews: 5 + (id * 13) % 400,
          isNew: id % 5 === 0,
          isOffer: hasOffer,
          material: ["Aluminio","Silicona","TPU","Vidrio","Policarbonato"][id % 5],
          image: svgImage(t.icon, pal[0], pal[1]),
          desc: `Accesorio premium ${t.base.toLowerCase()} de ${b}. Compatible con ${comp}. Diseño futurista y materiales de alta calidad.`
        });
      });
    });
  });
  return items;
})();

/* ---------- 2) STATE ---------- */
const LS = {
  get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)) }
};
const state = {
  cart: LS.get("ibite:cart", []),         // [{id, qty}]
  wish: LS.get("ibite:wish", []),         // [id]
  filters: {
    q: "",
    categories: new Set(),
    brands: new Set(),
    compats: new Set(),
    colors: new Set(),
    priceMax: 200000,
    onlyStock: false,
    onlyOffer: false,
    onlyNew: false,
    rating: 0
  },
  sort: "popular"
};

/* ---------- 3) INIT / Utils ---------- */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => "$" + n.toLocaleString("es-AR");
const stars = r => "★".repeat(Math.round(r)) + "☆".repeat(5-Math.round(r));

function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>t.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderCategories();
  renderFilters();
  renderBrands();
  renderProducts();
  renderOffers();
  renderNew();
  updateBadges();
  bindHeader();
  bindDrawers();
  bindFilters();
  bindSearch();
  bindQuickView();
  bindNewsletter();
  bindToTop();
  bindReveal();
  bindCursor();
  startParticles();
  startCountdown();
  // Hide loader
  setTimeout(()=>$("#loader").classList.add("hide"), 600);
});

/* ---------- 4) RENDER ---------- */
function renderCategories(){
  const el = $("#catsGrid");
  el.innerHTML = CATEGORIES.map(c => `
    <button class="cat reveal" data-cat="${c.id}">
      <div class="cat__icon">${c.icon}</div>
      <h4>${c.name}</h4>
      <small>${PRODUCTS.filter(p=>p.category===c.id).length} productos</small>
    </button>
  `).join("");
  $$(".cat", el).forEach(b => b.addEventListener("click", () => {
    state.filters.categories = new Set([b.dataset.cat]);
    // sync chips
    $$("#fCategory button").forEach(x => x.classList.toggle("active", x.dataset.val===b.dataset.cat));
    renderProducts();
    $("#products").scrollIntoView({behavior:"smooth"});
  }));
  bindReveal();
}

function renderBrands(){
  const el = $("#brandsTrack");
  // duplicar para marquee infinito
  el.innerHTML = [...BRANDS,...BRANDS].map(b => `<span>${b}</span>`).join("");
}

function productCard(p){
  const inWish = state.wish.includes(p.id);
  return `
  <article class="card reveal" data-id="${p.id}">
    <div class="card__media">
      <div class="card__tags">
        ${p.isNew?'<span class="tag tag--new">Nuevo</span>':''}
        ${p.isOffer?`<span class="tag tag--off">-${p.discount}%</span>`:''}
        ${p.stock===0?'<span class="tag tag--out">Sin stock</span>':''}
      </div>
      <div class="card__actions">
        <button class="icon-btn js-wish ${inWish?'active':''}" aria-label="Favorito" title="Favorito">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z"/></svg>
        </button>
        <button class="icon-btn js-qv" aria-label="Vista rápida" title="Vista rápida">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/></svg>
        </button>
      </div>
      <img class="card__img" src="${p.image}" alt="${p.name}" loading="lazy" />
    </div>
    <div class="card__body">
      <span class="card__brand">${p.brand} · ${p.compat}</span>
      <h3 class="card__name">${p.name}</h3>
      <div class="card__stars">${stars(p.rating)} <small>(${p.reviews})</small></div>
      <div class="card__price">
        <span class="price-now">${money(p.price)}</span>
        ${p.oldPrice?`<span class="price-old">${money(p.oldPrice)}</span>`:""}
      </div>
      <button class="card__buy js-add" ${p.stock===0?"disabled":""}>
        ${p.stock===0?"Sin stock":"Agregar al carrito"}
      </button>
    </div>
  </article>`;
}

let currentList = [];
function renderProducts(){
  const grid = $("#productsGrid");
  const sk = $("#skeletonGrid");
  // Skeleton
  sk.innerHTML = Array.from({length:8}).map(()=>'<div class="sk"></div>').join("");
  sk.style.display = "grid";
  grid.style.display = "none";
  setTimeout(() => {
    const list = filterAndSort(PRODUCTS);
    currentList = list;
    $("#resultCount").textContent = list.length;
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<p class="muted" style="grid-column:1/-1;text-align:center;padding:2rem">Sin resultados. Probá con otros filtros.</p>`;
    bindCardEvents(grid);
    sk.style.display = "none";
    grid.style.display = "grid";
    bindReveal();
  }, 350);
}

function renderNew(){
  const list = PRODUCTS.filter(p=>p.isNew).slice(0, 8);
  $("#newGrid").innerHTML = list.map(productCard).join("");
  bindCardEvents($("#newGrid"));
}

function renderOffers(){
  const list = PRODUCTS.filter(p=>p.isOffer).slice(0, 12);
  $("#offersTrack").innerHTML = list.map(productCard).join("");
  bindCardEvents($("#offersTrack"));
  // Nav
  const track = $("#offersTrack");
  $(".carousel__nav--prev","#offersCarousel").addEventListener("click", ()=>track.scrollBy({left:-300,behavior:"smooth"}));
  $(".carousel__nav--next","#offersCarousel").addEventListener("click", ()=>track.scrollBy({left:300,behavior:"smooth"}));
}

function bindCardEvents(root){
  $$(".js-add", root).forEach(b => b.addEventListener("click", e => {
    const id = +e.target.closest(".card").dataset.id;
    addToCart(id);
  }));
  $$(".js-wish", root).forEach(b => b.addEventListener("click", e => {
    const id = +e.target.closest(".card").dataset.id;
    toggleWish(id);
    b.classList.toggle("active", state.wish.includes(id));
  }));
  $$(".js-qv", root).forEach(b => b.addEventListener("click", e => {
    const id = +e.target.closest(".card").dataset.id;
    openQuickView(id);
  }));
  $$(".card__img, .card__name", root).forEach(b => b.addEventListener("click", e => {
    const id = +e.target.closest(".card").dataset.id;
    openQuickView(id);
  }));
}

/* ---------- 5) FILTROS / BUSCADOR / ORDEN ---------- */
function renderFilters(){
  $("#fCategory").innerHTML = CATEGORIES.map(c => `<button data-val="${c.id}">${c.name}</button>`).join("");
  $("#fBrand").innerHTML = BRANDS.map(b => `<button data-val="${b}">${b}</button>`).join("");
  $("#fCompat").innerHTML = COMPATS.map(c => `<button data-val="${c}">${c}</button>`).join("");
  $("#fColor").innerHTML = COLORS.map(c =>
    `<button data-val="${c.id}" title="${c.name}" style="background:${c.hex};color:${c.hex}"></button>`).join("");
  $("#fRating").innerHTML = [1,2,3,4,5].map(n => `<button data-val="${n}">★</button>`).join("");
}

function bindFilters(){
  const bindChipGroup = (sel, setKey) => {
    $$(`${sel} button`).forEach(b => b.addEventListener("click", () => {
      const v = b.dataset.val;
      const s = state.filters[setKey];
      if(s.has(v)) s.delete(v); else s.add(v);
      b.classList.toggle("active");
      renderProducts();
    }));
  };
  bindChipGroup("#fCategory","categories");
  bindChipGroup("#fBrand","brands");
  bindChipGroup("#fCompat","compats");
  bindChipGroup("#fColor","colors");

  $("#priceRange").addEventListener("input", e => {
    state.filters.priceMax = +e.target.value;
    $("#priceMax").textContent = money(state.filters.priceMax);
    renderProducts();
  });
  ["onlyStock","onlyOffer","onlyNew"].forEach(id => {
    $("#"+id).addEventListener("change", e => {
      state.filters[id] = e.target.checked;
      renderProducts();
    });
  });
  $$("#fRating button").forEach(b => b.addEventListener("click", () => {
    const v = +b.dataset.val;
    state.filters.rating = state.filters.rating===v ? 0 : v;
    $$("#fRating button").forEach((x,i) => x.classList.toggle("active", i < state.filters.rating));
    renderProducts();
  }));
  $("#sort").addEventListener("change", e => { state.sort = e.target.value; renderProducts(); });
  $("#clearFilters").addEventListener("click", () => {
    state.filters = {
      q:"", categories:new Set(), brands:new Set(), compats:new Set(), colors:new Set(),
      priceMax:200000, onlyStock:false, onlyOffer:false, onlyNew:false, rating:0
    };
    $$(".filters .chips button, #fRating button").forEach(b => b.classList.remove("active"));
    $$(".filters input[type=checkbox]").forEach(i => i.checked=false);
    $("#priceRange").value = 200000;
    $("#priceMax").textContent = "$200.000";
    renderProducts();
  });
  // Abrir filtros en mobile
  $("#openFilters").addEventListener("click", ()=>$("#filters").classList.add("open"));
  $("#filtersClose").addEventListener("click", ()=>$("#filters").classList.remove("open"));
}

function filterAndSort(list){
  const f = state.filters;
  let r = list.filter(p => {
    if(f.q){
      const q = f.q.toLowerCase();
      if(!(p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
           p.compat.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))) return false;
    }
    if(f.categories.size && !f.categories.has(p.category)) return false;
    if(f.brands.size && !f.brands.has(p.brand)) return false;
    if(f.compats.size && !f.compats.has(p.compat)) return false;
    if(f.colors.size && !f.colors.has(p.color)) return false;
    if(p.price > f.priceMax) return false;
    if(f.onlyStock && p.stock===0) return false;
    if(f.onlyOffer && !p.isOffer) return false;
    if(f.onlyNew && !p.isNew) return false;
    if(f.rating && p.rating < f.rating) return false;
    return true;
  });
  switch(state.sort){
    case "recent": r.sort((a,b)=>b.id-a.id); break;
    case "price-asc": r.sort((a,b)=>a.price-b.price); break;
    case "price-desc": r.sort((a,b)=>b.price-a.price); break;
    case "rating": r.sort((a,b)=>b.rating-a.rating); break;
    case "offer": r.sort((a,b)=>(b.discount||0)-(a.discount||0)); break;
    default: r.sort((a,b)=>b.reviews-a.reviews);
  }
  return r;
}

/* --- Buscador con autocomplete --- */
function bindSearch(){
  const bar = $("#searchBar"), input = $("#searchInput"), list = $("#searchResults");
  const open = () => { bar.classList.add("open"); setTimeout(()=>input.focus(),100); };
  const close = () => { bar.classList.remove("open"); input.value=""; list.innerHTML=""; state.filters.q=""; renderProducts(); };
  $("#searchToggle").addEventListener("click", () => bar.classList.contains("open") ? close() : open());
  $("#searchClose").addEventListener("click", close);
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    state.filters.q = q;
    if(!q){ list.innerHTML=""; renderProducts(); return; }
    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
      p.compat.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    ).slice(0, 8);
    list.innerHTML = matches.length ? matches.map(p => `
      <li data-id="${p.id}">
        <img class="thumb" src="${p.image}" alt=""/>
        <div class="meta">
          <span>${p.name}</span>
          <small>${p.brand} · ${p.compat} · ${CATEGORIES.find(c=>c.id===p.category).name}</small>
        </div>
        <span class="price">${money(p.price)}</span>
      </li>`).join("") : `<li><small class="muted">Sin resultados para "${q}"</small></li>`;
    $$("li[data-id]", list).forEach(li => li.addEventListener("click", () => {
      openQuickView(+li.dataset.id); close();
    }));
    renderProducts();
  });
}

/* ---------- 6) CARRITO / WISH / CUENTA ---------- */
function addToCart(id, qty=1){
  const it = state.cart.find(x=>x.id===id);
  if(it) it.qty += qty; else state.cart.push({id, qty});
  LS.set("ibite:cart", state.cart);
  updateBadges(); renderCart();
  toast("Agregado al carrito 🛒");
}
function removeCart(id){ state.cart = state.cart.filter(x=>x.id!==id); LS.set("ibite:cart", state.cart); updateBadges(); renderCart(); }
function changeQty(id, delta){
  const it = state.cart.find(x=>x.id===id); if(!it) return;
  it.qty = Math.max(1, it.qty+delta);
  LS.set("ibite:cart", state.cart); updateBadges(); renderCart();
}
function toggleWish(id){
  const i = state.wish.indexOf(id);
  if(i>=0) state.wish.splice(i,1); else state.wish.push(id);
  LS.set("ibite:wish", state.wish);
  updateBadges(); renderWish();
  toast(i>=0 ? "Quitado de favoritos" : "Guardado en favoritos ❤");
}
function updateBadges(){
  $("#cartBadge").textContent = state.cart.reduce((s,i)=>s+i.qty,0);
  $("#wishBadge").textContent = state.wish.length;
}
function renderCart(){
  const el = $("#cartItems");
  if(!state.cart.length){ el.innerHTML = '<div class="empty">Tu carrito está vacío 🛒</div>'; $("#cartSubtotal").textContent="$0"; return; }
  el.innerHTML = state.cart.map(it => {
    const p = PRODUCTS.find(x=>x.id===it.id);
    return `<div class="mini">
      <img class="mini__img" src="${p.image}" alt=""/>
      <div class="mini__info">
        <span class="mini__name">${p.name}</span>
        <span class="mini__meta">${p.brand} · ${p.compat}</span>
        <span class="mini__price">${money(p.price*it.qty)}</span>
        <div style="display:flex;align-items:center;gap:.6rem;margin-top:.3rem">
          <div class="qty">
            <button data-act="dec" data-id="${p.id}">−</button>
            <span>${it.qty}</span>
            <button data-act="inc" data-id="${p.id}">+</button>
          </div>
          <button class="mini__rm" data-act="rm" data-id="${p.id}">Eliminar</button>
        </div>
      </div>
    </div>`;
  }).join("");
  const sub = state.cart.reduce((s,it)=>s + it.qty*PRODUCTS.find(p=>p.id===it.id).price, 0);
  $("#cartSubtotal").textContent = money(sub);
  $$("button[data-act]", el).forEach(b => b.addEventListener("click", () => {
    const id = +b.dataset.id;
    if(b.dataset.act==="inc") changeQty(id, 1);
    if(b.dataset.act==="dec") changeQty(id, -1);
    if(b.dataset.act==="rm") removeCart(id);
  }));
}
function renderWish(){
  const el = $("#wishItems");
  if(!state.wish.length){ el.innerHTML = '<div class="empty">Aún no tenés favoritos ❤</div>'; return; }
  el.innerHTML = state.wish.map(id => {
    const p = PRODUCTS.find(x=>x.id===id);
    return `<div class="mini">
      <img class="mini__img" src="${p.image}" alt=""/>
      <div class="mini__info">
        <span class="mini__name">${p.name}</span>
        <span class="mini__meta">${p.brand} · ${p.compat}</span>
        <span class="mini__price">${money(p.price)}</span>
        <div style="display:flex;gap:.5rem;margin-top:.4rem">
          <button class="btn btn--neon btn--sm" data-add="${p.id}">Comprar</button>
          <button class="btn btn--ghost btn--sm" data-rm="${p.id}">Quitar</button>
        </div>
      </div>
    </div>`;
  }).join("");
  $$("[data-add]", el).forEach(b => b.addEventListener("click", ()=>addToCart(+b.dataset.add)));
  $$("[data-rm]", el).forEach(b => b.addEventListener("click", ()=>toggleWish(+b.dataset.rm)));
}

function bindDrawers(){
  const openDrawer = id => { $("#"+id).classList.add("open"); $("#scrim").classList.add("show"); };
  const closeAll = () => { $$(".drawer").forEach(d=>d.classList.remove("open")); $("#scrim").classList.remove("show"); $("#quickView").classList.remove("open"); };
  $("#cartToggle").addEventListener("click", () => { renderCart(); openDrawer("cartDrawer"); });
  $("#wishlistToggle").addEventListener("click", () => { renderWish(); openDrawer("wishDrawer"); });
  $("#userToggle").addEventListener("click", () => openDrawer("userDrawer"));
  $("#scrim").addEventListener("click", closeAll);
  $$("[data-close]").forEach(b => b.addEventListener("click", closeAll));
  $("#clearCart").addEventListener("click", () => { state.cart = []; LS.set("ibite:cart", []); updateBadges(); renderCart(); });
  // Tabs cuenta
  $$(".tab").forEach(t => t.addEventListener("click", () => {
    $$(".tab").forEach(x=>x.classList.remove("active"));
    $$(".tab-pane").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    $(`.tab-pane[data-pane="${t.dataset.tab}"]`).classList.add("active");
  }));
  document.addEventListener("keydown", e => { if(e.key==="Escape") closeAll(); });
}

/* ---------- 7) QUICK VIEW ---------- */
function openQuickView(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  const cat = CATEGORIES.find(c=>c.id===p.category).name;
  $("#qvBody").innerHTML = `
    <div class="qv">
      <div class="qv__gallery"><img src="${p.image}" alt="${p.name}"/></div>
      <div class="qv__info">
        <span class="card__brand">${p.brand} · ${cat}</span>
        <h3>${p.name}</h3>
        <div class="card__stars">${stars(p.rating)} <small>(${p.reviews} reseñas)</small></div>
        <div class="card__price">
          <span class="price-now">${money(p.price)}</span>
          ${p.oldPrice?`<span class="price-old">${money(p.oldPrice)}</span>`:""}
          ${p.isOffer?`<span class="tag tag--off">-${p.discount}%</span>`:""}
        </div>
        <p>${p.desc}</p>
        <div class="qv__specs">
          <div><small>Compatibilidad</small><strong>${p.compat}</strong></div>
          <div><small>Material</small><strong>${p.material}</strong></div>
          <div><small>Color</small><strong style="display:inline-flex;align-items:center;gap:.4rem">
            <span style="width:12px;height:12px;border-radius:50%;background:${p.colorHex};display:inline-block"></span>
            ${COLORS.find(c=>c.id===p.color).name}</strong></div>
          <div><small>Stock</small><strong>${p.stock>0 ? p.stock+" u." : "Sin stock"}</strong></div>
        </div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <button class="btn btn--neon" ${p.stock===0?"disabled":""} id="qvBuy">Comprar ahora</button>
          <button class="btn btn--ghost" id="qvAdd" ${p.stock===0?"disabled":""}>+ Carrito</button>
          <button class="btn btn--ghost" id="qvWish">${state.wish.includes(p.id)?"♥ Guardado":"♡ Favorito"}</button>
        </div>
      </div>
    </div>`;
  $("#quickView").classList.add("open"); $("#scrim").classList.add("show");
  $("#qvAdd").addEventListener("click", ()=>addToCart(p.id));
  $("#qvBuy").addEventListener("click", ()=>{ addToCart(p.id); $("#quickView").classList.remove("open"); $("#cartDrawer").classList.add("open"); renderCart(); });
  $("#qvWish").addEventListener("click", ()=>{ toggleWish(p.id); openQuickView(p.id); });
}
function bindQuickView(){
  $("#qvClose").addEventListener("click", () => { $("#quickView").classList.remove("open"); $("#scrim").classList.remove("show"); });
  $("#quickView").addEventListener("click", e => { if(e.target.id==="quickView"){ $("#quickView").classList.remove("open"); $("#scrim").classList.remove("show"); } });
}

/* ---------- 8) HEADER / MENU / CURSOR / PARTICLES / REVEAL ---------- */
function bindHeader(){
  const h = $("#header");
  const onScroll = () => h.classList.toggle("scrolled", window.scrollY > 20);
  onScroll(); window.addEventListener("scroll", onScroll, { passive:true });

  const menu = $("#menuToggle"), nav = $("#nav");
  menu.addEventListener("click", () => { menu.classList.toggle("active"); nav.classList.toggle("open"); });
  $$("#nav a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("active"); nav.classList.remove("open"); }));

  // Ripple/glow en botones
  $$(".btn").forEach(b => b.addEventListener("mousemove", e => {
    const r = b.getBoundingClientRect();
    b.style.setProperty("--mx", (e.clientX-r.left)+"px");
    b.style.setProperty("--my", (e.clientY-r.top)+"px");
  }));
}

function bindReveal(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: .12 });
  $$(".reveal:not(.is-visible)").forEach(el => io.observe(el));
}

function bindCursor(){
  if(matchMedia("(pointer:coarse)").matches) { $("#cursor").style.display="none"; $("#cursorDot").style.display="none"; return; }
  const c = $("#cursor"), d = $("#cursorDot");
  let x=0,y=0,tx=0,ty=0;
  window.addEventListener("mousemove", e => { tx=e.clientX; ty=e.clientY; d.style.transform=`translate(${tx}px,${ty}px) translate(-50%,-50%)`; });
  (function loop(){ x += (tx-x)*.18; y += (ty-y)*.18; c.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  document.addEventListener("mouseover", e => {
    if(e.target.closest("a,button,.card,.cat")) { c.style.width="60px"; c.style.height="60px"; c.style.background="rgba(168,85,247,.15)"; }
    else { c.style.width="36px"; c.style.height="36px"; c.style.background="transparent"; }
  });
}

function startParticles(){
  const canvas = $("#particles"), ctx = canvas.getContext("2d");
  let w,h,parts;
  const colors = ["#22d3ee","#a855f7","#ec4899","#3b82f6"];
  function resize(){ w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight;
    const n = Math.min(70, Math.floor(w*h/16000));
    parts = Array.from({length:n}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      r: Math.random()*1.8+.5,
      vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4,
      c: colors[Math.floor(Math.random()*colors.length)]
    }));
  }
  resize(); window.addEventListener("resize", resize);
  (function tick(){
    ctx.clearRect(0,0,w,h);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = p.c; ctx.shadowBlur = 12; ctx.shadowColor = p.c;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  })();
}

/* ---------- 9) COUNTDOWN / NEWSLETTER / TO-TOP / LOADER ---------- */
function startCountdown(){
  const end = Date.now() + 1000*60*60*8; // 8 hs
  const H = $("#cdH"), M = $("#cdM"), S = $("#cdS");
  const pad = n => String(n).padStart(2,"0");
  setInterval(() => {
    let d = Math.max(0, end - Date.now());
    const h = Math.floor(d/3600000); d -= h*3600000;
    const m = Math.floor(d/60000); d -= m*60000;
    const s = Math.floor(d/1000);
    H.textContent = pad(h); M.textContent = pad(m); S.textContent = pad(s);
  }, 1000);
}

function bindNewsletter(){
  $("#newsForm").addEventListener("submit", e => {
    e.preventDefault();
    $("#newsMsg").textContent = "¡Listo! Revisá tu email para confirmar 🚀";
    e.target.reset();
    setTimeout(()=>$("#newsMsg").textContent="", 4000);
  });
}

function bindToTop(){
  const btn = $("#toTop");
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 400), { passive:true });
  btn.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
}

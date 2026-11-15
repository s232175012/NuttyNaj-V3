const products = [
  {id:'cashew-milkchoc',category:'Cashew Nuts',name:'Cashew - Milk Chocolate Coated',image:'Images/cashew-milkchoc.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:22},
  {id:'cashew-peri',category:'Cashew Nuts',name:'Cashew - Extra Hot Peri-Peri',image:'Images/cashew-peri.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'cashew-plain',category:'Cashew Nuts',name:'Cashew - Roasted Plain',image:'Images/cashew-plain.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'cashew-raw',category:'Cashew Nuts',name:'Cashew - Raw',image:'Images/cashew-raw.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'cashew-roasted-salted',category:'Cashew Nuts',name:'Cashew - Roasted Salted',image:'Images/cashew-roasted-salted.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'cashew-yoghurt',category:'Cashew Nuts',name:'Cashew - Yoghurt Coated',image:'Images/cashew-yoghurt.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:22},
  {id:'macadamia-milkchoc',category:'Macadamia Nuts',name:'Macadamia - Milk Chocolate Coated',image:'Images/macadamia-milkchoc.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:22},
  {id:'macadamia-peri',category:'Macadamia Nuts',name:'Macadamia - Extra Hot Peri-Peri',image:'Images/macadamia-peri.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'macadamia-plain',category:'Macadamia Nuts',name:'Macadamia - Roasted Plain',image:'Images/macadamia-plain.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'macadamia-raw',category:'Macadamia Nuts',name:'Macadamia - Raw',image:'Images/macadamia-raw.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'macadamia-roasted-salted',category:'Macadamia Nuts',name:'Macadamia - Roasted Salted',image:'Images/macadamia-roasted-salted.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'macadamia-yoghurt',category:'Macadamia Nuts',name:'Macadamia - Yoghurt Coated',image:'Images/macadamia-yoghurt.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:22},
  {id:'pecan-lightly-salted',category:'Pecan Nuts',name:'Pecan Nuts - Lightly Salted',image:'Images/pecan-lightly-salted.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'walnut-lightly-salted',category:'Walnut Nuts',name:'Walnut Nuts - Lightly Salted',image:'Images/walnut-lightly-salted.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'hazelnut-lightly-salted',category:'Hazelnuts',name:'Hazelnut - Lightly Salted',image:'Images/hazelnut-lightly-salted.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'pistachio-lightly-salted',category:'Pistachio Nuts',name:'Pistachio - Lightly Salted',image:'Images/pistachio-lightly-salted.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'mixed-salted',category:'Mixed Nuts',name:'Mixed Nuts - Salted',image:'Images/mixed-salted.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
  {id:'dried-jungle-mix',category:'Dried Fruits',name:'Dried Fruits - Jungle Mix',image:'Images/dried-jungle-mix.jpg',desc:"50g kraft box, hand-packed in Benoni.",price:18},
];

const catMap = {
  'Cashew Nuts':'cashew','Macadamia Nuts':'macadamia','Pecan Nuts':'pecan',
  'Walnut Nuts':'walnut','Hazelnuts':'hazelnut','Pistachio Nuts':'pistachio',
  'Mixed Nuts':'mixed','Dried Fruits':'dried'
};

const grid = document.getElementById("productGrid");
const noResult = document.getElementById("noResult");
let currentFilter = "all";

function render(){
  if(!grid) return;
  grid.innerHTML = "";
  const list = products.filter(p => currentFilter === "all" || catMap[p.category] === currentFilter);
  if(noResult) noResult.hidden = list.length !== 0;
  list.forEach(p => {
    const parts = p.name.split(" - ");
    const small = parts[0].replace(" Nuts","").replace(" Fruits","");
    const big = parts[1] || parts[0];
    const el = document.createElement("article");
    el.className = "product";
    el.innerHTML = `
      <div class="p-img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/400x550/d9a55a/2b1a08?text=${encodeURIComponent(p.name)}'"></div>
      <p class="p-cat">${small}</p>
      <h3>${big}</h3>
      <p class="p-price">R${p.price}</p>
      <button class="add-btn" data-id="${p.id}">Add to cart</button>`;
    grid.appendChild(el);
  });
}

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ===== CART DRAWER =====
const WHATSAPP_NUMBER = "27630457655";
const FREE_COURIER = 351;

let cart = {};
const cartCount = document.getElementById("cartCount");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const courierMsg = document.getElementById("courierMsg");
const whatsappBtn = document.getElementById("whatsappBtn");

function getTotal(){
  return Object.entries(cart).reduce((sum,[id,qty])=>{
    const p = products.find(x=>x.id===id);
    return sum + (p ? p.price*qty : 0);
  },0);
}
function getCount(){
  return Object.values(cart).reduce((a,b)=>a+b,0);
}

function renderCart(){
  const total = getTotal();
  if(cartCount) cartCount.textContent = getCount();
  if(cartTotalEl) cartTotalEl.textContent = "R" + total;

  if(total >= FREE_COURIER){
    courierMsg.textContent = "You get free courier!";
    courierMsg.classList.add("free");
  } else {
    courierMsg.textContent = `Add R${FREE_COURIER - total} more for free courier. Otherwise the courier cost is confirmed with your order.`;
    courierMsg.classList.remove("free");
  }

  if(getCount() === 0){
    whatsappBtn.classList.add("disabled");
    whatsappBtn.href = "#";
  } else {
    whatsappBtn.classList.remove("disabled");
    const lines = Object.entries(cart).map(([id,qty])=>{
      const p = products.find(x=>x.id===id);
      return `• ${p.name} x${qty} - R${p.price*qty}`;
    });
    const msg = `Hi NuttyNaj! I want to order:\n\n${lines.join("\n")}\n\nTotal: R${total}`;
    whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  if(getCount() === 0){
    cartItemsEl.innerHTML = `<p class="cart-empty">Nothing in here yet. Add a box from the range.</p>`;
    return;
  }
  cartItemsEl.innerHTML = Object.entries(cart).map(([id,qty])=>{
    const p = products.find(x=>x.id===id);
    const parts = p.name.split(" - ");
    const small = parts[0];
    const big = parts[1] || "";
    return `
    <div class="cart-item">
      <img src="${p.image}" alt="${p.name}">
      <div class="cart-info"><b>${small}</b><span>${big}, R${p.price}</span></div>
      <div class="cart-qty">
        <button class="qty-btn" data-action="minus" data-id="${id}">−</button>
        <span class="qty-num">${qty}</span>
        <button class="qty-btn" data-action="plus" data-id="${id}">+</button>
      </div>
    </div>`;
  }).join("");
}

document.getElementById("openCart").addEventListener("click", ()=>{
  drawer.classList.add("open");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
});
function closeCart(){
  drawer.classList.remove("open");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", e => {
  if(e.key === "Escape") closeCart();
});

if(grid){
  grid.addEventListener("click", e => {
    if(!e.target.classList.contains("add-btn")) return;
    const id = e.target.dataset.id;
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    const btn = e.target;
    btn.textContent = "Added ✓";
    setTimeout(() => btn.textContent = "Add to cart", 800);
  });
}

cartItemsEl.addEventListener("click", e => {
  const btn = e.target.closest(".qty-btn");
  if(!btn) return;
  const id = btn.dataset.id;
  if(btn.dataset.action === "plus") cart[id]++;
  if(btn.dataset.action === "minus"){
    cart[id]--;
    if(cart[id] <= 0) delete cart[id];
  }
  renderCart();
});

document.getElementById("emptyCart").addEventListener("click", ()=>{
  cart = {};
  renderCart();
});

renderCart();
render();
// Basit render ve event bağlama iskeleti
(function(){
  const productListEl = document.getElementById('product-list');
  const cartEl = document.getElementById('cart');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const openCartBtn = document.getElementById('open-cart');
  const closeCartBtn = document.getElementById('close-cart');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');
  const backdropEl = document.getElementById('backdrop');

  function formatTRY(value){
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
  }

  function renderProducts(){
    if(!window.PRODUCTS) return;
    productListEl.innerHTML = window.PRODUCTS.map(p => `
      <article class="product-card" role="listitem">
        <img src="${p.image}" alt="${p.title}">
        <div class="content">
          <h3 class="title">${p.title}</h3>
          <div class="price">${formatTRY(p.price)}</div>
          <button class="btn btn-primary" data-add="${p.id}">Sepete Ekle</button>
        </div>
      </article>
    `).join('');
  }

  function renderCart(){
    const cart = Cart.readCart();
    const entries = Object.values(cart.items);
    if(entries.length === 0){
      cartItemsEl.innerHTML = `<div class="muted">Sepetiniz boş.</div>`;
    } else {
      cartItemsEl.innerHTML = entries.map(({ product, qty }) => `
        <div class="cart-item" role="listitem">
          <img src="${product.image}" alt="${product.title}">
          <div class="meta">
            <p class="title">${product.title}</p>
            <p class="qty">Adet: ${qty}</p>
          </div>
          <div class="actions">
            <button class="btn btn-ghost" data-dec="${product.id}">-</button>
            <button class="btn btn-ghost" data-inc="${product.id}">+</button>
            <button class="btn btn-ghost" data-del="${product.id}">Sil</button>
          </div>
        </div>
      `).join('');
    }

    const summary = Cart.getSummary();
    cartTotalEl.textContent = formatTRY(summary.total);
    openCartBtn.textContent = `Sepet (${summary.totalQty})`;
    checkoutBtn.disabled = summary.totalQty === 0;
  }

  function bindEvents(){
    productListEl.addEventListener('click', (e) => {
      const addId = e.target.closest('[data-add]')?.getAttribute('data-add');
      if(!addId) return;
      const product = window.PRODUCTS.find(p => p.id === addId);
      if(product) Cart.addItem(addId, product, 1);
    });

    cartItemsEl.addEventListener('click', (e) => {
      const inc = e.target.closest('[data-inc]')?.getAttribute('data-inc');
      const dec = e.target.closest('[data-dec]')?.getAttribute('data-dec');
      const del = e.target.closest('[data-del]')?.getAttribute('data-del');
      if(inc){ const p = window.PRODUCTS.find(x => x.id === inc); if(p) Cart.addItem(inc, p, 1); }
      if(dec){ Cart.removeItem(dec, 1); }
      if(del){ Cart.deleteItem(del); }
    });

    clearCartBtn.addEventListener('click', () => Cart.clearCart());
    function openDrawer(){
      cartEl.setAttribute('data-open', '');
      backdropEl.hidden = false;
      openCartBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer(){
      cartEl.removeAttribute('data-open');
      backdropEl.hidden = true;
      openCartBtn.setAttribute('aria-expanded', 'false');
    }

    openCartBtn.addEventListener('click', () => {
      if(cartEl.hasAttribute('data-open')) closeDrawer(); else openDrawer();
    });
    closeCartBtn.addEventListener('click', closeDrawer);
    backdropEl.addEventListener('click', closeDrawer);

    window.addEventListener('cart:changed', renderCart);
  }

  // İlk yüklemede render
  renderProducts();
  bindEvents();
  renderCart();
})();


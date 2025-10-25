// Sepet modülü iskeleti: LocalStorage destekli
;(function(){
  const STORAGE_KEY = "mini_cart_v1";

  function readCart(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { items: {} };
    } catch (e){
      return { items: {} };
    }
  }

  function writeCart(cart){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart:changed", { detail: cart }));
  }

  function addItem(productId, product, qty = 1){
    const cart = readCart();
    const existing = cart.items[productId] || { product, qty: 0 };
    existing.qty += qty;
    cart.items[productId] = existing;
    writeCart(cart);
  }

  function removeItem(productId, qty = 1){
    const cart = readCart();
    const existing = cart.items[productId];
    if(!existing) return;
    existing.qty -= qty;
    if(existing.qty <= 0){
      delete cart.items[productId];
    } else {
      cart.items[productId] = existing;
    }
    writeCart(cart);
  }

  function deleteItem(productId){
    const cart = readCart();
    delete cart.items[productId];
    writeCart(cart);
  }

  function clearCart(){
    writeCart({ items: {} });
  }

  function getSummary(){
    const cart = readCart();
    const entries = Object.values(cart.items);
    const totalQty = entries.reduce((s, it) => s + it.qty, 0);
    const total = entries.reduce((s, it) => s + it.qty * it.product.price, 0);
    return { totalQty, total };
  }

  window.Cart = { readCart, addItem, removeItem, deleteItem, clearCart, getSummary };
})();


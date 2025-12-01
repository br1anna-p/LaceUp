const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Render cart items
async function renderCart() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalEl.textContent = '';
    checkoutBtn.style.display = 'none';
    return;
  }

  checkoutBtn.style.display = 'inline-block';

  let total = 0;

  for (let item of cart) {
    const res = await fetch(`/api/products/${item.id}`);
    const product = await res.json();
    total += product.price;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}" width="80">
      <span>${product.name} - $${product.price.toFixed(2)}</span>
      <button data-id="${item.id}" class="remove-btn">Remove</button>
    `;
    cartItemsEl.appendChild(div);
  }

  cartTotalEl.textContent = `Subtotal: $${total.toFixed(2)}`;
}

// Remove item from cart
cartItemsEl.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-btn')) {
    const id = Number(e.target.dataset.id);
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
});

// Checkout button
checkoutBtn.addEventListener('click', () => {
  window.location.href = '/checkout.html';
});

renderCart();

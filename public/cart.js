const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');

// Load cart from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

if (cart.length === 0) {
  cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
  cartTotalEl.textContent = '';
} else {
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="100">
      <div class="cart-info">
        <strong>${item.name}</strong>
        <p>Size ID: ${item.sizeId}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

  // Remove item functionality
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      location.reload(); // refresh to update cart
    });
  });
}

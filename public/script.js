// ================= LOAD PRODUCTS =================
async function loadProducts() {
  try {
    const response = await fetch('/products');
    const products = await response.json();

    const container = document.getElementById('product-list');
    if (!container) return;

    container.innerHTML = '';
    products.forEach(p => {
      container.innerHTML += `
        <div class="product-card">
          <img src="${p.image_url}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
          <button onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${p.image_url}')">Add to Cart</button>
        </div>
      `;
    });
  } catch (err) {
    console.error('Error loading products:', err);
  }
}

// ================= CART SYSTEM =================
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, name, price, image_url) {
  let cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, image_url, quantity: 1 });
  }

  saveCart(cart);
  alert('Added to cart!');
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartDisplay = document.getElementById('cart-count');
  if (cartDisplay) cartDisplay.textContent = count;
}

// ================= Registration/Login Helpers =================
async function registerUser(event) {
  event.preventDefault();
  const F_name = document.getElementById('F_name').value;
  const L_name = document.getElementById('L_name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ F_name, L_name, email, password })
  });

  const result = await response.json();
  if (result.error) {
    alert(result.error);
  } else {
    alert('Account created!');
    window.location.href = '/login.html';
  }
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartCount();
});

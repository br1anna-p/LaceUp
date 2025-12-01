const summaryEl = document.getElementById('checkout-summary');
const placeOrderBtn = document.getElementById('place-order');

async function loadSummary() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (cart.length === 0) {
    summaryEl.innerHTML = '<p>Your cart is empty.</p>';
    placeOrderBtn.style.display = 'none';
    return;
  }

  let subtotal = 0;
  let html = '<ul>';

  for (let item of cart) {
    const res = await fetch(`/api/products/${item.id}`);
    const product = await res.json();
    subtotal += Number(product.price);
    html += `<li>${product.name} - $${product.price.toFixed(2)}</li>`;
  }

  html += '</ul>';
  html += `<p>Subtotal: $${subtotal.toFixed(2)}</p>`;
  html += `<p>Tax: $${(subtotal * 0.0825).toFixed(2)}</p>`;
  html += `<p><strong>Total: $${(subtotal * 1.0825).toFixed(2)}</strong></p>`;

  summaryEl.innerHTML = html;
}

placeOrderBtn.addEventListener('click', async () => {
  const token = localStorage.getItem('token'); // Optional auth check

  if (!token) {
    alert("Login required.");
    window.location.href = "/login.html";
    return;
  }

  // Example POST request to create order (backend needs /api/orders route)
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ items: cart })
  });

  const data = await res.json();

  if (data.success) {
    alert("Order placed!");
    localStorage.removeItem('cart');
    window.location.href = '/';
  } else {
    alert(data.error || "Order failed.");
  }
});

loadSummary();

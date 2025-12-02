const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');

// Load cart from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];
let originalTotal = 0; // we'll use this for discounts

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

  originalTotal = total; // save original un-discounted total

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

/* -------------------------------------------------------
   DISCOUNT CODE LOGIC
-------------------------------------------------------- */

document.getElementById("apply-discount-btn")?.addEventListener("click", async () => {
  const codeInput = document.getElementById("discount-code");
  const msg = document.getElementById("discount-message");

  const code = codeInput.value.trim();

  if (!code) {
    msg.style.color = "red";
    msg.textContent = "Please enter a promo code.";
    return;
  }

  try {
    // Call backend to validate promo code
    const response = await fetch(`/api/discount/${code}`);
    const data = await response.json();

    if (!data.success) {
      msg.style.color = "red";
      msg.textContent = "Invalid or inactive discount code.";
      return;
    }

    const discount = data.discount;

    let finalTotal = originalTotal;

    if (discount.type === "percentage") {
      finalTotal -= (finalTotal * (discount.amount / 100));
    } else if (discount.type === "fixed") {
      finalTotal -= discount.amount;
    }

    if (finalTotal < 0) finalTotal = 0;

    cartTotalEl.textContent = `Total after discount: $${finalTotal.toFixed(2)}`;

    msg.style.color = "green";
    msg.textContent = `Discount applied: ${discount.code}`;

  } catch (error) {
    msg.style.color = "red";
    msg.textContent = "Error applying discount. Try again.";
  }
});


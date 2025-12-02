// ===============================
// USER + CART KEYS
// ===============================
const user = JSON.parse(localStorage.getItem("user"));

let cartKey = "cart_guest";
let discountKey = "discounts_guest";

if (user) {
  cartKey = `cart_${user.id}`;
  discountKey = `discounts_${user.id}`;
}

let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
let appliedDiscounts = JSON.parse(localStorage.getItem(discountKey)) || [];

// ===============================
// ELEMENTS
// ===============================
const itemsEl = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("checkout-subtotal");
const discountsEl = document.getElementById("checkout-discounts");
const totalEl = document.getElementById("checkout-total");

// ===============================
// RENDER CHECKOUT SUMMARY
// ===============================
function renderCheckout() {
  if (cart.length === 0) {
    itemsEl.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "0.00";
    totalEl.textContent = "0.00";
    discountsEl.textContent = "None";
    return;
  }

  let subtotal = 0;
  itemsEl.innerHTML = "";

  // Build the item list with picture + info
  cart.forEach(item => {
    subtotal += item.price;

    itemsEl.innerHTML += `
      <div class="summary-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="summary-details">
          <strong>${item.name}</strong><br>
          Size: ${item.sizeId}<br>
          Price: $${item.price.toFixed(2)}
        </div>
      </div>
    `;
  });

  subtotalEl.textContent = subtotal.toFixed(2);

  // ==========================
  // APPLY DISCOUNTS
  // ==========================
  let finalTotal = subtotal;
  let discountText = [];

  // Percentage discount (max 1)
  const percent = appliedDiscounts.find(d => d.type === "percentage");
  if (percent) {
    const amount = finalTotal * (percent.amount / 100);
    finalTotal -= amount;
    discountText.push(`${percent.code} (-${percent.amount}%)`);
  }

  // Fixed discounts (max 2)
  appliedDiscounts
    .filter(d => d.type === "fixed")
    .slice(0, 2)
    .forEach(d => {
      finalTotal -= d.amount;
      discountText.push(`${d.code} (-$${d.amount})`);
    });

  discountsEl.textContent = discountText.length ? discountText.join(", ") : "None";

  if (finalTotal < 0) finalTotal = 0;
  totalEl.textContent = finalTotal.toFixed(2);
}

renderCheckout();

// ===============================
// PLACE ORDER BUTTON
// ===============================
document.getElementById("place-order-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Clear user cart & discounts
  localStorage.removeItem(cartKey);
  localStorage.removeItem(discountKey);

  // Redirect to confirmation page
  window.location = "/order-confirmation.html";
});

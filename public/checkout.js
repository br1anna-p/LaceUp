// ===============================
// USER + CART + DISCOUNT SETUP
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

// Elements
const itemsEl = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("checkout-subtotal");
const discountsEl = document.getElementById("checkout-discounts");
const totalEl = document.getElementById("checkout-total");

// ===============================
// DISPLAY CHECKOUT ITEMS
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
  cart.forEach(item => {
    subtotal += item.price;

    itemsEl.innerHTML += `
      <p>${item.name} — $${item.price.toFixed(2)}</p>
    `;
  });

  subtotalEl.textContent = subtotal.toFixed(2);

  // Apply discounts
  let finalTotal = subtotal;
  let discountText = [];

  const percent = appliedDiscounts.find(d => d.type === "percentage");
  if (percent) {
    const amount = finalTotal * (percent.amount / 100);
    finalTotal -= amount;
    discountText.push(`${percent.code} (-${percent.amount}%)`);
  }

  appliedDiscounts
    .filter(d => d.type === "fixed")
    .slice(0, 2)
    .forEach(d => {
      finalTotal -= d.amount;
      discountText.push(`${d.code} (-$${d.amount})`);
    });

  if (discountText.length === 0) {
    discountsEl.textContent = "None";
  } else {
    discountsEl.textContent = discountText.join(", ");
  }

  if (finalTotal < 0) finalTotal = 0;
  totalEl.textContent = finalTotal.toFixed(2);
}

renderCheckout();

// ===============================
// PLACE ORDER
// ===============================
document.getElementById("place-order-btn").addEventListener("click", () => {

  // Clear cart + discounts
  localStorage.removeItem(cartKey);
  localStorage.removeItem(discountKey);

  // Redirect to confirmation page
  window.location = "/order-confirmation.html";
});

// ===============================
// USER + CART + DISCOUNT SETUP
// ===============================
const user = JSON.parse(localStorage.getItem("user"));
// ===============================
// AUTO-FILL CHECKOUT IF LOGGED IN
// ===============================
function autofillUser() {
  if (!user) return; // guest user, do nothing

  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const emailField = document.getElementById("email");

  if (firstName) firstName.value = user.F_name || "";
  if (lastName) lastName.value = user.L_name || "";
  if (emailField) emailField.value = user.email || "";
}

autofillUser();


let cartKey = "cart_guest";
let discountKey = "discounts_guest";

if (user) {
  cartKey = `cart_${user.id}`;
  discountKey = `discounts_${user.id}`;
}

let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
let appliedDiscounts = JSON.parse(localStorage.getItem(discountKey)) || [];

// ===============================
// CONSTANTS (you can change TAX_RATE)
// ===============================
const TAX_RATE = 0.0825;        // 8.25% tax – change if needed
const EXPRESS_SHIPPING = 14.99; // express shipping price

// Elements
const itemsEl = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("checkout-subtotal");
const discountsEl = document.getElementById("checkout-discounts");
const shippingEl = document.getElementById("checkout-shipping");
const taxEl = document.getElementById("checkout-tax");
const totalEl = document.getElementById("checkout-total");

// ===============================
// HELPER: get selected shipping
// ===============================
function getSelectedShippingCost() {
  const radios = document.querySelectorAll('input[name="shipping-method"]');
  let value = "free";

  radios.forEach(r => {
    if (r.checked) value = r.value;
  });

  if (value === "express") return EXPRESS_SHIPPING;
  return 0; // standard / free
}

// ===============================
// RENDER CHECKOUT SUMMARY
// ===============================
function renderCheckout() {
  if (cart.length === 0) {
    itemsEl.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "0.00";
    discountsEl.textContent = "None";
    shippingEl.textContent = "$0.00";
    taxEl.textContent = "$0.00";
    totalEl.textContent = "0.00";
    return;
  }

  let subtotal = 0;
  itemsEl.innerHTML = "";

  // Build item list with picture + info
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

  // ---------- DISCOUNTS ----------
  let discounted = subtotal;
  let discountText = [];

  // One percentage discount max
  const percent = appliedDiscounts.find(d => d.type === "percentage");
  if (percent) {
    const amount = discounted * (percent.amount / 100);
    discounted -= amount;
    discountText.push(`${percent.code} (-${percent.amount}%)`);
  }

  // Up to two fixed discounts
  appliedDiscounts
    .filter(d => d.type === "fixed")
    .slice(0, 2)
    .forEach(d => {
      discounted -= d.amount;
      discountText.push(`${d.code} (-$${d.amount})`);
    });

  if (discounted < 0) discounted = 0;

  discountsEl.textContent = discountText.length ? discountText.join(", ") : "None";

  // ---------- SHIPPING ----------
  const shippingCost = getSelectedShippingCost();
  shippingEl.textContent = `$${shippingCost.toFixed(2)}`;

  // ---------- TAX ----------
  // Tax on discounted merchandise total (not on shipping)
  const taxAmount = discounted * TAX_RATE;
  taxEl.textContent = `$${taxAmount.toFixed(2)}`;

  // ---------- FINAL TOTAL ----------
  const finalTotal = discounted + shippingCost + taxAmount;
  totalEl.textContent = finalTotal.toFixed(2);
}

renderCheckout();

// Recalculate when shipping method changes
document.querySelectorAll('input[name="shipping-method"]').forEach(radio => {
  radio.addEventListener("change", renderCheckout);
});

// ===============================
// PLACE ORDER BUTTON
// ===============================
document.getElementById("place-order-btn").addEventListener("click", () => {
  const errorMsg = document.getElementById("checkout-error");

  // Collect fields you want to validate
  const requiredFields = [
    document.getElementById("first-name"),
    document.getElementById("last-name"),
    document.getElementById("address"),
    document.getElementById("city"),
    document.getElementById("state"),
    document.getElementById("zip"),
    document.getElementById("card-number"),
    document.getElementById("card-exp"),
    document.getElementById("card-cvv")
  ];

  // Check for any empty fields
  for (let field of requiredFields) {
    if (!field || field.value.trim() === "") {
      errorMsg.textContent = "Please fill out all required fields.";
      errorMsg.style.display = "block";
      return; // stop the checkout
    }
  }

  // If everything is filled → remove error
  errorMsg.style.display = "none";

  // Now continue with placing the order
  localStorage.removeItem(cartKey);
  localStorage.removeItem(discountKey);

  window.location = "/order-confirmation.html";
});

// =====================
// CART SETUP
// =====================
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

const cart = JSON.parse(localStorage.getItem("cart")) || [];
let originalTotal = 0;

// Load saved discounts
let appliedDiscounts =
  JSON.parse(localStorage.getItem("appliedDiscounts")) || [];

function saveDiscounts() {
  localStorage.setItem("appliedDiscounts", JSON.stringify(appliedDiscounts));
}

// --------------------
// DISPLAY CART
// --------------------
if (cart.length === 0) {
  cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
  cartTotalEl.textContent = "";
} else {
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.classList.add("cart-item");

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

  originalTotal = total;
  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;

  // remove buttons
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);

      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    });
  });
}

// =====================
// DISCOUNT INPUT FORMAT
// =====================
const discountInput = document.getElementById("discount-code");

if (discountInput) {
  discountInput.addEventListener("input", () => {
    discountInput.value = discountInput.value.toUpperCase();
  });
}

// =====================
// APPLY DISCOUNT
// =====================
document
  .getElementById("apply-discount-btn")
  ?.addEventListener("click", async () => {
    const codeInput = document.getElementById("discount-code");
    const msg = document.getElementById("discount-message");

    const code = codeInput.value.trim();
    if (!code) {
      msg.style.color = "red";
      msg.textContent = "Please enter a promo code.";
      return;
    }

    // Prevent duplicate use
    if (appliedDiscounts.some((d) => d.code === code)) {
      msg.style.color = "red";
      msg.textContent = "This discount has already been used.";
      return;
    }

    try {
      const response = await fetch(`/api/discount/${code}`);
      const data = await response.json();

      if (!data.success) {
        msg.style.color = "red";
        msg.textContent = "Invalid or inactive discount code.";
        return;
      }

      const discount = data.discount;

      // -------- RULES ----------
      if (discount.type === "percentage") {
        if (appliedDiscounts.some((d) => d.type === "percentage")) {
          msg.style.color = "red";
          msg.textContent = "You can only apply one percentage discount.";
          return;
        }
      }

      if (discount.type === "fixed") {
        const fixedUsed = appliedDiscounts.filter(
          (d) => d.type === "fixed"
        ).length;

        if (fixedUsed >= 2) {
          msg.style.color = "red";
          msg.textContent = "You can only apply two fixed discounts.";
          return;
        }
      }

      // Add discount
      appliedDiscounts.push(discount);
      saveDiscounts();

      updateDisplayedTotal();

      msg.style.color = "green";
      msg.textContent = `Discount applied: ${discount.code}`;
    } catch (error) {
      msg.style.color = "red";
      msg.textContent = "Error applying discount.";
    }
  });

// =====================
// TOTAL CALCULATION
// =====================
function calculateFinalTotal() {
  let total = originalTotal;

  const percent = appliedDiscounts.find((d) => d.type === "percentage");
  if (percent) total -= total * (percent.amount / 100);

  appliedDiscounts
    .filter((d) => d.type === "fixed")
    .slice(0, 2)
    .forEach((d) => {
      total -= d.amount;
    });

  return Math.max(total, 0);
}

function updateDisplayedTotal() {
  const finalTotal = calculateFinalTotal();
  cartTotalEl.textContent = `Total: $${finalTotal.toFixed(2)}`;
}

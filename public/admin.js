// Redirect if not admin
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
  alert("Access denied — Admins only");
  window.location = "/";
}

document.getElementById("admin-welcome").textContent =
  `Logged in as: ${user.F_name} (Admin)`;

// ==========================
// LOAD PRODUCTS
// ==========================
async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  const table = document.getElementById("product-table");

  products.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>$${p.price}</td>
        <td><button onclick="deleteProduct(${p.id})">Delete</button></td>
      </tr>
    `;
  });
}

async function deleteProduct(id) {
  const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
  const data = await res.json();

  if (data.success) {
    alert("Product deleted.");
    location.reload();
  }
}

// ==========================
// LOAD DISCOUNTS
// ==========================
async function loadDiscounts() {
  const res = await fetch("/api/discounts");
  const discounts = await res.json();

  const table = document.getElementById("discount-table");

  discounts.forEach(d => {
    table.innerHTML += `
      <tr>
        <td>${d.code}</td>
        <td>${d.type}</td>
        <td>${d.amount}</td>
        <td>${d.active ? "Yes" : "No"}</td>
      </tr>
    `;
  });
}

// ===============================
// ADD SIZE BUTTON (MUST BE OUTSIDE)
// ===============================
document.getElementById("add-size-btn").addEventListener("click", () => {
  const container = document.getElementById("size-area");

  container.innerHTML += `
    <div class="size-row">
      <input type="text" class="size-input" placeholder="Size (ex: 6, 5T, 6Y)">
      <input type="number" class="qty-input" placeholder="Quantity">
    </div>
  `;
});

// ==========================
// ADD PRODUCT + ADD SIZES
// ==========================
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("p-name").value.trim();
  const desc = document.getElementById("p-desc").value.trim();
  const price = document.getElementById("p-price").value.trim();
  const image = document.getElementById("p-img").value.trim();

  const msg = document.getElementById("product-message");

  if (!name || !desc || !price || !image) {
    msg.style.color = "red";
    msg.textContent = "Please fill all product fields.";
    return;
  }

  // 1️⃣ Create product first
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      description: desc,
      image_url: image,
      price,
      quantity: 1  // this will NOT be used—sizes carry quantity
    })
  });

  const data = await res.json();

  if (!data.success) {
    msg.style.color = "red";
    msg.textContent = "Failed to add product.";
    return;
  }

  const productId = data.productId;

  // 2️⃣ Add each size row
  const sizeRows = document.querySelectorAll(".size-row");

  for (const row of sizeRows) {
    const size = row.querySelector(".size-input").value.trim();
    const qty = row.querySelector(".qty-input").value.trim();

    if (!size || !qty) continue;

    await fetch("/api/product-sizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        size,
        quantity: qty
      })
    });
  }

  msg.style.color = "green";
  msg.textContent = "Product + sizes added successfully!";
  document.getElementById("add-product-form").reset();
  document.getElementById("size-area").innerHTML = "";
});

// ==========================
// ADD DISCOUNT
// ==========================
document.getElementById("add-discount-btn").addEventListener("click", async () => {
  const code = document.getElementById("new-discount-code").value.trim();
  const amount = document.getElementById("new-discount-amount").value;
  const type = document.getElementById("new-discount-type").value;

  const res = await fetch("/api/discounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, amount, type })
  });

  const data = await res.json();

  if (!data.success) {
    alert("Error creating discount.");
    return;
  }

  alert("Discount created!");
  location.reload();
});

// ==========================
// LOAD ORDERS
// ==========================
async function loadOrders() {
  const res = await fetch("/api/orders");
  const orders = await res.json();

  const table = document.getElementById("order-table");

  orders.forEach(o => {
    table.innerHTML += `
      <tr>
        <td>${o.id}</td>
        <td>${o.order_date}</td>
        <td>$${o.total}</td>
        <td>${o.user_id}</td>
      </tr>
    `;
  });
}

// Run all
loadProducts();
loadDiscounts();
loadOrders();

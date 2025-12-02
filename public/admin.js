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

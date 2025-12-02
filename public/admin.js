// ===============================
// ADMIN AUTH CHECK
// ===============================
const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "admin") {
  alert("Access denied: Admins only");
  window.location = "/";
}

// Show greeting
document.getElementById("admin-welcome").textContent =
  `Logged in as: ${user.F_name} (${user.role})`;


// ===============================
// LOAD PRODUCTS
// ===============================
async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  let html = `
    <table>
      <tr>
        <th>ID</th><th>Name</th><th>Price</th><th>Image</th><th>Actions</th>
      </tr>
  `;

  products.forEach(p => {
    html += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>$${p.price}</td>
        <td><img src="${p.image_url}" width="60"></td>
        <td><button onclick="deleteProduct(${p.id})">Delete</button></td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("products-table").innerHTML = html;
}


// ===============================
// DELETE PRODUCT
// ===============================
async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();
  if (data.success) loadProducts();
}


// ===============================
// LOAD DISCOUNTS
// ===============================
async function loadDiscounts() {
  const res = await fetch("/api/discounts");
  const discounts = await res.json();

  let html = `
    <table>
      <tr><th>Code</th><th>Type</th><th>Amount</th><th>Active</th></tr>
  `;

  discounts.forEach(d => {
    html += `
      <tr>
        <td>${d.code}</td>
        <td>${d.type}</td>
        <td>${d.amount}</td>
        <td>${d.active ? "YES" : "NO"}</td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("discounts-table").innerHTML = html;
}


// ===============================
// CREATE DISCOUNT
// ===============================
async function createDiscount() {
  const code = document.getElementById("new-discount-code").value.toUpperCase();
  const amount = document.getElementById("new-discount-amount").value;
  const type = document.getElementById("new-discount-type").value;

  const res = await fetch("/api/discounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, amount, type })
  });

  const data = await res.json();
  if (data.success) {
    alert("Discount created!");
    loadDiscounts();
  }
}


// ===============================
// LOAD ORDERS
// ===============================
async function loadOrders() {
  const res = await fetch("/api/orders");
  const orders = await res.json();

  let html = `
    <table>
      <tr><th>Order ID</th><th>User</th><th>Total</th><th>Date</th></tr>
  `;

  orders.forEach(o => {
    html += `
      <tr>
        <td>${o.id}</td>
        <td>${o.user_id}</td>
        <td>$${o.total}</td>
        <td>${o.order_date}</td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("orders-table").innerHTML = html;
}


// Run initial loads
loadProducts();
loadDiscounts();
loadOrders();

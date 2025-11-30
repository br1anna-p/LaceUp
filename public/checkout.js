async function loadSummary() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const summary = document.getElementById("summary");

  let subtotal = 0;

  for (let item of cart) {
    const res = await fetch(`/api/products/${item.id}`);
    const product = await res.json();
    subtotal += Number(product.price);
  }

  summary.innerHTML = `
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Tax: $${(subtotal * 0.0825).toFixed(2)}</p>
    <p><strong>Total: $${(subtotal * 1.0825).toFixed(2)}</strong></p>
  `;
}

document.getElementById("place-order").onclick = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  if (data.success) {
    alert("Order placed!");
    localStorage.removeItem("cart");
    window.location = "/";
  } else {
    alert("Login required.");
    window.location = "/login.html";
  }
};

loadSummary();

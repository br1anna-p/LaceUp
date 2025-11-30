async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const res = await fetch(`/api/products/${id}`);
  const product = await res.json();

  const sizesRes = await fetch(`/api/products/${id}/sizes`);
  const sizes = await sizesRes.json();

  const page = document.getElementById("product-details");

  page.innerHTML = `
    <img src="${product.image_url}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <strong>$${product.price}</strong>

    <label>Size:</label>
    <select id="size-select">
      ${sizes.map(s => `<option value="${s.id}">${s.size}</option>`).join("")}
    </select>

    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
}

function addToCart(id) {
  const sizeId = document.getElementById("size-select").value;

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cart.push({ id, sizeId, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart!");
}

loadProduct();

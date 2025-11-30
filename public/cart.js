async function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const container = document.getElementById("cart-items");

  container.innerHTML = "";

  for (let item of cart) {
    const res = await fetch(`/api/products/${item.id}`);
    const product = await res.json();

    container.innerHTML += `
      <div class="cart-item">
        <img src="${product.image_url}">
        <p>${product.name}</p>
        <p>Size: ${item.sizeId}</p>
        <p>$${product.price}</p>
        <button onclick="removeItem(${item.id}, ${item.sizeId})">Remove</button>
      </div>
    `;
  }
}

function removeItem(id, sizeId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter(i => !(i.id == id && i.sizeId == sizeId));
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

loadCart();

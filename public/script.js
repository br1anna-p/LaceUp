async function loadFeaturedProducts() {
  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(p => {
      container.innerHTML += `
        <div class="product-card">
          <img src="${p.image_url}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
          <a href="product.html?id=${p.id}">View Product</a>
        </div>
      `;
    });

  } catch (err) {
    console.error("Error loading featured:", err);
  }
}

loadFeaturedProducts();

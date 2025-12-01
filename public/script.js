async function loadFeaturedProducts() {
  try {
    const res = await fetch("/api/products"); // endpoint from your Express app
    const products = await res.json();

    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(product => {
      container.innerHTML += `
        <div class="product-card">
          <img src="${product.image_url}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>$${product.price.toFixed(2)}</p>
          <a href="product.html?id=${product.id}">View Product</a>
        </div>
      `;
    });

  } catch (err) {
    console.error("Error loading products:", err);
    const container = document.getElementById("products");
    container.innerHTML = "<p>Unable to load products at this time.</p>";
  }
}

// Run on page load
loadFeaturedProducts();

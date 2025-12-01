// Stores all products for search filtering
let allProducts = [];


async function loadFeaturedProducts() {
  try {
    const res = await fetch("/api/products");
    const products = await res.json();
    allProducts = products; // Save full list for searching
    

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

// Renders only the filtered products
function displayFilteredProducts(list) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  list.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image_url}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <a href="product.html?id=${p.id}">View Product</a>
      </div>
    `;
  });
}

// Search bar listener (filters products as user types)
document.getElementById("searchInput").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(searchText)
  );

  displayFilteredProducts(filtered);
});



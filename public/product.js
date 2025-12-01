// =====================
// product.js
// =====================

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const imgEl = document.getElementById('product-img');
const nameEl = document.getElementById('product-name');
const descEl = document.getElementById('product-desc');
const priceEl = document.getElementById('product-price');
const sizeSelect = document.getElementById('size-select');
const addToCartBtn = document.getElementById('add-to-cart');

async function loadProduct() {
  try {
    // Fetch product details
    const res = await fetch(`/api/products/${productId}`);
    if (!res.ok) throw new Error('Product not found');
    const product = await res.json();

    imgEl.src = product.image_url;
    imgEl.alt = product.name;
    nameEl.textContent = product.name;
    descEl.textContent = product.description;
    priceEl.textContent = `$${product.price.toFixed(2)}`;

    // Fetch sizes for the product
    const sizesRes = await fetch(`/api/products/${productId}/sizes`);
    if (!sizesRes.ok) throw new Error('Sizes not found');
    const sizes = await sizesRes.json();

    sizeSelect.innerHTML = ''; // Clear existing options
    sizes.forEach(size => {
      const option = document.createElement('option');
      option.value = size.id;
      option.textContent = `${size.size} (${size.quantity} in stock)`;
      sizeSelect.appendChild(option);
    });

  } catch (err) {
    console.error('Error loading product:', err);
    document.getElementById('product-page').innerHTML =
      '<p>Unable to load product at this time.</p>';
  }
}

// Add to Cart functionality
addToCartBtn.addEventListener('click', () => {
  const selectedSizeId = sizeSelect.value;
  if (!selectedSizeId) {
    alert('Please select a size');
    return;
  }
  alert(`Product ${productId} (size ID: ${selectedSizeId}) added to cart!`);
  // TODO: Replace alert with actual cart logic (localStorage or API call)
});

loadProduct();

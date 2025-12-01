// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const imgEl = document.getElementById('product-img');
const nameEl = document.getElementById('product-name');
const descEl = document.getElementById('product-desc');
const priceEl = document.getElementById('product-price');
const sizeSelect = document.getElementById('size-select');
const addToCartBtn = document.getElementById('add-to-cart');

let product; // store product info globally

async function loadProduct() {
  try {
    // Fetch product details
    const res = await fetch(`/api/products/${productId}`);
    if (!res.ok) throw new Error('Product not found');
    product = await res.json();

    imgEl.src = product.image_url;
    imgEl.alt = product.name;
    nameEl.textContent = product.name;
    descEl.textContent = product.description;
    priceEl.textContent = `$${parseFloat(product.price).toFixed(2)}`;

    // Fetch sizes for the product
    const sizesRes = await fetch(`/api/products/${productId}/sizes`);
    if (!sizesRes.ok) throw new Error('Sizes not found');
    const sizes = await sizesRes.json();

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

  // Get existing cart from localStorage or empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Add the product
  cart.push({
    id: productId,
    name: nameEl.textContent,
    price: parseFloat(product.price),
    sizeId: selectedSizeId,
    image: imgEl.src
  });

  // Save back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

    // Save back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // -------------------------
  // Inline "added to cart" notice with View Cart link
  // -------------------------
  const notice = document.getElementById('cart-notice');

  // Fill the notice with message, a View Cart link, and a close button
  notice.innerHTML = `
    <div class="notice-inner" role="status" style="display:flex;align-items:center;gap:12px;padding:10px;border-radius:6px;background:#fff;border:1px solid #ddd;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <span style="font-weight:600">${nameEl.textContent} added to cart.</span>
      <a href="cart.html" class="view-cart-btn" style="padding:8px 12px;border-radius:6px;background:#222;color:#fff;text-decoration:none;font-weight:600;">View Cart</a>
      <button class="close-notice" aria-label="Close" style="background:transparent;border:none;font-size:18px;line-height:1;cursor:pointer;">&times;</button>
    </div>
  `;

  // Show the notice
  notice.style.display = 'block';

  // Close handler
  const closeBtn = notice.querySelector('.close-notice');
  const closeNotice = () => {
    notice.style.display = 'none';
    notice.innerHTML = '';
  };
  if (closeBtn) closeBtn.addEventListener('click', closeNotice);

  // Auto-hide after 6 seconds
  setTimeout(closeNotice, 6000);
});

loadProduct();

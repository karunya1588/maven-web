const productsData = [
  {
    "id": 1,
    "name": "Classic Gold Necklace",
    "price": 12500,
    "brand": "Sona",
    "img": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop",
    "description": "Elegantly crafted gold necklace perfect for weddings."
  },
  {
    "id": 2,
    "name": "Pearl Drop Earrings",
    "price": 4200,
    "brand": "PearlCo",
    "img": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=200&fit=crop",
    "description": "Delicate pearl earrings for everyday elegance."
  },
  {
    "id": 3,
    "name": "Diamond Solitaire Ring",
    "price": 45000,
    "brand": "Spark",
    "img": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=200&fit=crop",
    "description": "A timeless diamond solitaire ring."
  },
  {
    "id": 4,
    "name": "Kundan Choker",
    "price": 9800,
    "brand": "Rajwada",
    "img": "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=300&h=200&fit=crop",
    "description": "Traditional kundan choker for festive occasions."
  },
  {
    "id": 5,
    "name": "Silver Anklet",
    "price": 1800,
    "brand": "SilverStar",
    "img": "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=200&fit=crop",
    "description": "Lightweight silver anklet with ghungroo bells."
  },
  {
    "id": 6,
    "name": "Gold Bracelet",
    "price": 8500,
    "brand": "Sona",
    "img": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=200&fit=crop",
    "description": "Elegant gold bracelet with intricate design."
  },
  {
    "id": 7,
    "name": "Ruby Pendant",
    "price": 15200,
    "brand": "PearlCo",
    "img": "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=300&h=200&fit=crop",
    "description": "Beautiful ruby pendant with gold chain."
  },
  {
    "id": 8,
    "name": "Emerald Ring",
    "price": 32000,
    "brand": "Spark",
    "img": "https://images.unsplash.com/photo-1544966503-7adcaa882d7d?w=300&h=200&fit=crop",
    "description": "Stunning emerald ring with diamond accents."
  },
  {
    "id": 9,
    "name": "Temple Earrings",
    "price": 6800,
    "brand": "Rajwada",
    "img": "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=300&h=200&fit=crop",
    "description": "Traditional temple design gold earrings."
  },
  {
    "id": 10,
    "name": "Silver Chain",
    "price": 2200,
    "brand": "SilverStar",
    "img": "https://images.unsplash.com/photo-1609251312963-8f6b79d4e007?w=300&h=200&fit=crop",
    "description": "Simple and elegant silver chain necklace."
  }
];

let allProducts = productsData;
let filteredProducts = [...allProducts];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let likes = JSON.parse(localStorage.getItem('likes')) || {};
let ratings = JSON.parse(localStorage.getItem('ratings')) || {};

function updateCartBadge() {
  document.getElementById('cartBadge').textContent = cart.length;
}

function showToast(message) {
  document.getElementById('cartToastBody').textContent = message;
  const toast = new bootstrap.Toast(document.getElementById('cartToast'));
  toast.show();
}

function populateDropdown() {
  const dropdown = document.getElementById('productsDropdown');
  dropdown.innerHTML = '<li><a href="#productsSection" onclick="showAllProducts()">All Products</a></li>';
  
  allProducts.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#productsSection" onclick="filterByProduct('${product.name}')">${product.name}</a>`;
    dropdown.appendChild(li);
  });
}

function populateBrandFilter() {
  const brandFilter = document.getElementById('brandFilter');
  const brands = [...new Set(allProducts.map(p => p.brand))];
  
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });
}

function renderProducts() {
  const container = document.getElementById('product-row');
  container.innerHTML = '';

  filteredProducts.forEach(product => {
    const productLikes = likes[product.id] || 0;
    const isLiked = likes[`${product.id}_liked`] || false;
    const productRating = ratings[product.id] || 0;

    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
    
    col.innerHTML = `
      <div class="product-card" data-product-id="${product.id}">
        <div class="card-inner">
          <div class="card-front">
            <div class="card h-100">
              <img src="${product.img}" class="product-img" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop'">
              <div class="card-body d-flex flex-column">
                <h6 class="product-name">${product.name}</h6>
                <p class="price">₹${product.price.toLocaleString()}</p>
                <div class="rating-stars mb-2" data-product-id="${product.id}">
                  ${[1,2,3,4,5].map(star => 
                    `<i class="fas fa-star ${star <= productRating ? 'active' : ''}" data-rating="${star}"></i>`
                  ).join('')}
                </div>
                <div class="card-actions d-flex justify-content-between align-items-center mt-auto">
                  <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${product.id})" onmouseenter="disableFlip(${product.id})" onmouseleave="enableFlip(${product.id})">
                    <i class="fas fa-heart"></i> <span id="likeCount-${product.id}">${productLikes}</span>
                  </button>
                  <button class="btn btn-gold btn-sm" onclick="addToCart(${product.id})" onmouseenter="disableFlip(${product.id})" onmouseleave="enableFlip(${product.id})">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
          <div class="card-back">
            <div class="text-center">
              <h5 class="product-name">${product.name}</h5>
              <p class="text-muted">${product.description}</p>
              <p class="price">₹${product.price.toLocaleString()}</p>
              <div class="d-flex justify-content-center align-items-center gap-3 mt-3">
                <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${product.id})">
                  <i class="fas fa-heart"></i> <span>${productLikes}</span>
                </button>
                <button class="btn btn-gold btn-sm" onclick="addToCart(${product.id})">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(col);
  });

  document.querySelectorAll('.rating-stars').forEach(stars => {
    const productId = stars.dataset.productId;
    stars.addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-star')) {
        const rating = parseInt(e.target.dataset.rating);
        setRating(productId, rating);
      }
    });
  });
}

function disableFlip(productId) {
  const productCard = document.querySelector(`[data-product-id="${productId}"]`);
  productCard.classList.add('no-flip');
}

function enableFlip(productId) {
  const productCard = document.querySelector(`[data-product-id="${productId}"]`);
  productCard.classList.remove('no-flip');
}

function setRating(productId, rating) {
  ratings[productId] = rating;
  localStorage.setItem('ratings', JSON.stringify(ratings));
  
  const stars = document.querySelector(`[data-product-id="${productId}"]`).querySelectorAll('.fa-star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function toggleLike(productId) {
  const isLiked = likes[`${productId}_liked`] || false;
  
  if (isLiked) {
    likes[productId] = Math.max(0, (likes[productId] || 0) - 1);
    likes[`${productId}_liked`] = false;
  } else {
    likes[productId] = (likes[productId] || 0) + 1;
    likes[`${productId}_liked`] = true;
  }
  
  localStorage.setItem('likes', JSON.stringify(likes));
  
  const likeBtn = document.querySelector(`button[onclick="toggleLike(${productId})"]`);
  const likeCount = document.getElementById(`likeCount-${productId}`);
  
  likeBtn.classList.toggle('liked');
  likeCount.textContent = likes[productId] || 0;
}

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (product && !cart.find(item => item.id === productId)) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${product.name} added to cart`);
    updateCartDisplay();
  } else if (cart.find(item => item.id === productId)) {
    showToast(`${product.name} is already in cart`);
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartBody = document.getElementById('cartBody');
  const cartTotal = document.getElementById('cartTotal');
  
  cartBody.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${item.img}" alt="${item.name}" class="cart-item"></td
      >
      <td>${item.name}</td>
      <td>₹${item.price.toLocaleString()}</td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">Remove</button></td>
    `;
    cartBody.appendChild(row);
  });

  cartTotal.textContent = `₹${total.toLocaleString()}`;
}

function sortProducts() {
  const sortValue = document.getElementById('sortSelect').value;
  
  switch(sortValue) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name-az':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-za':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      filteredProducts = [...allProducts];
  }
  
  renderProducts();
}

function filterByBrand() {
  const brandValue = document.getElementById('brandFilter').value;
  
  if (brandValue === 'all') {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(product => product.brand === brandValue);
  }
  
  sortProducts();
}

function clearFilters() {
  document.getElementById('sortSelect').value = 'default';
  document.getElementById('brandFilter').value = 'all';
  filteredProducts = [...allProducts];
  renderProducts();
}

function showAllProducts() {
  document.getElementById('productsSection').style.display = 'block';
  document.getElementById('cartSection').style.display = 'none';
  document.getElementById('pageTitle').textContent = 'Products';
  filteredProducts = [...allProducts];
  renderProducts();
}

function filterByProduct(productName) {
  filteredProducts = allProducts.filter(product => product.name === productName);
  document.getElementById('pageTitle').textContent = productName;
  renderProducts();
}

function showCart() {
  document.getElementById('productsSection').style.display = 'none';
  document.getElementById('cartSection').style.display = 'block';
  updateCartDisplay();
}

document.getElementById('sortSelect').addEventListener('change', sortProducts);
document.getElementById('brandFilter').addEventListener('change', filterByBrand);
document.getElementById('clearFilters').addEventListener('click', clearFilters);
document.getElementById('navCart').addEventListener('click', (e) => {
  e.preventDefault();
  showCart();
});

document.addEventListener('DOMContentLoaded', () => {
  populateDropdown();
  populateBrandFilter();
  renderProducts();
  updateCartBadge();
  updateCartDisplay();
});
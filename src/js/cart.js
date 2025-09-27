import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartFooter = document.querySelector(".cart-footer");
  const cartList = document.querySelector(".product-list");
  const cartTotal = document.querySelector(".cart-total");

  if (cartItems.length === 0) {
    cartList.innerHTML = "<li>Your cart is empty</li>";
    cartTotal.innerHTML = "";
    cartFooter.classList.add("hide");
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  cartList.innerHTML = htmlItems.join("");

  // Calculate and display the total in Euros
  const total = cartItems.reduce(
    (acc, item) => acc + item.FinalPrice * (item.quantity || 1),
    0,
  );
  
  // Convert to Euros (assuming USD to EUR conversion rate of 0.85)
  const euroTotal = total;
  
  // Format as Euro currency
  const formattedEuroTotal = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(euroTotal);
  
  cartFooter.classList.remove("hide");
  cartTotal.innerHTML = `<strong>Total:</strong> ${formattedEuroTotal}`;

  // Add event listeners for remove buttons
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeItem(id, "so-cart");
    });
  });

  // Add event listeners for quantity inputs
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      const newQuantity = parseInt(e.target.value);
      updateQuantity(id, newQuantity);
    });

    input.addEventListener("blur", (e) => {
      const id = e.target.dataset.id;
      const newQuantity = parseInt(e.target.value);
      updateQuantity(id, newQuantity);
    });
  });
}

function renderWishContents() {
  const wishItems = getLocalStorage("so-fav") || [];

  if (wishItems.length === 0) {
    document.querySelector(".wish-list").innerHTML =
      "<li>Your wishList is empty</li>";
    return;
  }
  const htmlItems = wishItems.map((item) => cartItemTemplate(item, true));
  document.querySelector(".wish-list").innerHTML = htmlItems.join("");
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeItem(id, "so-fav");
    });
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      addToCartFromWish(id);
    });
  });
}

function addToCartFromWish(id) {
  const wishItems = getLocalStorage("so-fav") || [];
  const cartItems = getLocalStorage("so-cart") || [];

  const index = wishItems.findIndex((i) => i.Id === id);
  if (index === -1) return;

  const item = wishItems[index];

  const cartIndex = cartItems.findIndex((i) => i.Id === id);
  if (cartIndex !== -1) {
  } else {
    const toAdd = Object.assign({}, item);
    if (!toAdd.quantity) toAdd.quantity = 1;
    cartItems.push(toAdd);
  }

  wishItems.splice(index, 1);

  setLocalStorage("so-cart", cartItems);
  setLocalStorage("so-fav", wishItems);

  renderCartContents();
  renderWishContents();
  updateCartCount();
}

function cartItemTemplate(item, isFav = false) {
  // Safely get the image URL
  const imageUrl =
    item.Images?.PrimaryExtraLarge ||
    item.Images?.PrimaryLarge ||
    "/images/placeholder.jpg";

  // Safely get the color name
  const colorName = item.Colors?.[0]?.ColorName || "N/A";

  // Calculate discount badge
  const hasDiscount = item.SuggestedRetailPrice > item.FinalPrice;
  const discountBadge = hasDiscount
    ? `<span class="card-discount-badge">-${Math.round(((item.SuggestedRetailPrice - item.FinalPrice) / item.SuggestedRetailPrice) * 100)}%</span>`
    : "";
  
  const euroPriceFormatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(Number(item.FinalPrice));
  
  const addToCartBtn = isFav
    ? `<button class="add-to-cart" data-id="${item.Id}" aria-label="Add ${item.Name} to Cart">Add to Cart</button>`
    : "";
    
  const quantityControls = !isFav 
    ? `<div class="quantity-controls">
         <label for="qty-${item.Id}" class="quantity-label">qty:</label>
         <input type="number" 
                id="qty-${item.Id}"
                class="quantity-input" 
                data-id="${item.Id}" 
                value="${item.quantity || 1}" 
                min="1" 
                max="99"
                aria-label="Quantity for ${item.Name}">
       </div>`
    : `qty: ${item.quantity || 1}`;

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${imageUrl}" alt="${item.Name}" />
        ${addToCartBtn}
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">Color: ${colorName}</p>
      <p class="cart-card__quantity">${quantityControls}</p>
      <p class="cart-card__price">${discountBadge}${euroPriceFormatted}</p>
      <span class="remove-item" data-id="${item.Id}" style="cursor:pointer;">✕</span>

    </li>
  `;
}

function updateQuantity(id, newQuantity) {
  const cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex((item) => item.Id === id);

  if (itemIndex !== -1) {
    // Validate quantity
    if (isNaN(newQuantity) || newQuantity < 1) {
      // If invalid quantity, remove item
      cartItems.splice(itemIndex, 1);
    } else {
      // Update quantity (limit to reasonable maximum)
      cartItems[itemIndex].quantity = Math.min(newQuantity, 99);
    }

    setLocalStorage("so-cart", cartItems);
    renderCartContents();
    updateCartCount();
  }
}

function removeItem(id, storage) {
  const cartItems = getLocalStorage(storage) || [];
  const index = cartItems.findIndex((item) => item.Id === id);

  if (index !== -1) {
    cartItems.splice(index, 1);
    setLocalStorage(storage, cartItems);
    renderCartContents();
    renderWishContents();
  }

  updateCartCount();
}

renderCartContents();
renderWishContents();
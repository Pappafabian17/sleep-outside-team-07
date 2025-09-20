import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = '<li>Your cart is empty</li>';
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeItemFromCart(id);
    });
  });

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeItemFromCart(id);
    });
  });
}

function cartItemTemplate(item) {
  // Safely get the image URL
  const imageUrl = item.Images?.PrimaryExtraLarge || item.Images?.PrimaryLarge || '/images/placeholder.jpg';

  // Safely get the color name
  const colorName = item.Colors?.[0]?.ColorName || 'N/A';

  // Calculate discount badge - ONLY NEW CODE ADDED HERE
  const hasDiscount = item.SuggestedRetailPrice > item.FinalPrice;
  const discountBadge = hasDiscount ?
    `<span class="card-discount-badge">-${Math.round(((item.SuggestedRetailPrice - item.FinalPrice) / item.SuggestedRetailPrice) * 100)}%</span>` : '';

  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${imageUrl}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${colorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">${discountBadge}$${item.FinalPrice}</p>
    </li>
    <span class="remove-item" data-id="${item.Id}" style="cursor:pointer;">✕</span>
  `;
}

function removeItemFromCart(id) {
  const cartItems = getLocalStorage("so-cart") || [];
  const index = cartItems.findIndex((item) => item.Id === id);

  if (index !== -1) {
    cartItems.splice(index, 1);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

renderCartContents();
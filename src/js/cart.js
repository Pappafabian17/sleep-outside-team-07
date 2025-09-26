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

  // Calculate and display the total
  const total = cartItems.reduce(
    (acc, item) => acc + item.FinalPrice * (item.quantity || 1),
    0,
  );
  cartFooter.classList.remove("hide");
  cartTotal.innerHTML = `<strong>Total:</strong> $${total.toFixed(2)}`;

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeItem(id, "so-cart");
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

  // Calculate discount badge - ONLY NEW CODE ADDED HERE
  const hasDiscount = item.SuggestedRetailPrice > item.FinalPrice;
  const discountBadge = hasDiscount
    ? `<span class="card-discount-badge">-${Math.round(((item.SuggestedRetailPrice - item.FinalPrice) / item.SuggestedRetailPrice) * 100)}%</span>`
    : "";
  const addToCartBtn = isFav
    ? `<button class="add-to-cart" data-id="${item.Id}" aria-label="Add ${item.Name} to Cart">Add to Cart</button>`
    : "";
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
      <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
      <p class="cart-card__price">${discountBadge}$${item.FinalPrice}</p>
      <span class="remove-item" data-id="${item.Id}" style="cursor:pointer;">✕</span>

    </li>
  `;
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

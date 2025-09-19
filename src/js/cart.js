import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeItemFromCart(id);
    });
  });
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      
      <a href="#" class="cart-card__image">
        <img src="${item.Images.PrimaryExtraLarge}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      
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

import {
  getParam,
  setLocalStorage,
  getLocalStorage,
  updateCartCount,
} from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productID = getParam("product");

const currentProduct = new ProductDetails(productID, dataSource);
currentProduct.init();

function addProductToCart(productItem) {
  // Get existing cart or create empty array
  const existingCart = getLocalStorage("so-cart") || [];

  // Check if the product already exists in the cart
  const existingItemIndex = existingCart.findIndex(
    (item) => item.Id === productItem.Id,
  );

  if (existingItemIndex !== -1) {
    // Product already exists - increase quantity
    existingCart[existingItemIndex].quantity =
      (existingCart[existingItemIndex].quantity || 1) + 1;
  } else {
    // Product doesn't exist, add it to cart with quantity 1
    productItem.quantity = 1;
    existingCart.push(productItem);
  }

  // Save updated cart
  setLocalStorage("so-cart", existingCart);

  // Update cart count display
  updateCartCount();
}

function addProductToFav(product) {
  const existingProductFav = getLocalStorage("so-fav") || [];
  const existingProdIndex = existingProductFav.findIndex(
    (item) => item.Id === product.Id,
  );
  if (existingProdIndex !== -1) {
    const filteredExistingFav = existingProductFav.filter(
      (item) => item.Id !== product.Id,
    );
    setLocalStorage("so-fav", filteredExistingFav);
    document.querySelector(".fav-item ").textContent = "⭐";
  } else {
    existingProductFav.push(product);
    setLocalStorage("so-fav", existingProductFav);
    document.querySelector(".fav-item ").textContent = "🌟";
  }
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}
async function addToFavtHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToFav(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
document.getElementById("addToFav").addEventListener("click", addToFavtHandler);

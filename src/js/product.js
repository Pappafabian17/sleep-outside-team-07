import {
  getParam,
  setLocalStorage,
  getLocalStorage,
  updateCartCount,
} from "./utils.mjs";
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
  const existingItemIndex = existingCart.findIndex(item => item.Id === productItem.Id);

  if (existingItemIndex !== -1) {
    // Product already exists - increase quantity
    existingCart[existingItemIndex].quantity = (existingCart[existingItemIndex].quantity || 1) + 1;
    console.log(`Increased quantity to ${existingCart[existingItemIndex].quantity}`);
  } else {
    // Product doesn't exist, add it to cart with quantity 1
    productItem.quantity = 1;
    existingCart.push(productItem);
    console.log("Added new item to cart");
  }

  // Save updated cart
  setLocalStorage("so-cart", existingCart);

  // Update cart count display
  updateCartCount();
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
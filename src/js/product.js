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

  // Add new product
  existingCart.push(productItem);

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

// Initialize cart count when this module loads
updateCartCount();

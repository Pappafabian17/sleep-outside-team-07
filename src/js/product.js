import { getParam, setLocalStorage, getLocalStorage, updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

function addProductToCart(product) {
  // Get existing cart or create empty array
  const existingCart = getLocalStorage("so-cart") || [];
  
  // Add new product
  existingCart.push(product);
  
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
import { updateCartCount, loadHeaderFooter } from "./utils.mjs";
import ProductSearch from "./ProductSearch.mjs"
import CheckoutProcess, { formatCardNumber, formatExpirationDate } from "./CheckoutProcess.mjs";

async function initPage() {
    await loadHeaderFooter();

  //initializes the behavior of the product search engine
  const productSearch = new ProductSearch();
  productSearch.init();

  // Initialize cart count when this module loads
  updateCartCount();

  const checkoutProcess = new CheckoutProcess("so-cart", ".checkout-summary");
  checkoutProcess.init();

  const cartNumberInput = document.querySelector("#cardNumber");

  if (cartNumberInput) {
    cartNumberInput.addEventListener('input', function () {
      formatCardNumber(this);
    });
  }

  const expirationDateInput = document.querySelector("#expiration");

  if (expirationDateInput) {
    expirationDateInput.addEventListener('input', function () {
      formatExpirationDate(this);
    })
  }
}

initPage();

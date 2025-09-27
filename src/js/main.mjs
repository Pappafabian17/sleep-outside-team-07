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

  const CHECKOUT_API_URL = "http://wdd330-backend.onrender.com/checkout/"; 

  const checkoutProcess = new CheckoutProcess("so-cart", ".checkout-summary", CHECKOUT_API_URL);
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

  const checkoutForm = document.getElementById('checkoutForm');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const success = await checkoutProcess.checkout(checkoutForm);

      if (success) {
        console.log("Order submitted and processed successfully");
      } else {
        console.log("Order submission failed");
      }
    })
  }
}

initPage();

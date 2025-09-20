import { updateCartCount, loadHeaderFooter } from "./utils.mjs";
import ProductSearch from "./ProductSearch.mjs"

async function initPage() {
    await loadHeaderFooter();

  //initializes the behavior of the product search engine
  const productSearch = new ProductSearch();
  productSearch.init();

  // Initialize cart count when this module loads
  updateCartCount();
}

initPage();

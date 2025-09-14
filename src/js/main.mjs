import { updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import ProductSearch from "./ProductSearch.mjs"
const productData = new ProductData("tents");

const productList = new ProductList("tents", productData, document.querySelector(".product-list"));
productList.init();
//initializes the behavior of the product search engine
const productSearch = new ProductSearch();
productSearch.init();
// Initialize cart count when this module loads
updateCartCount();
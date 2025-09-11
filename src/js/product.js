import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");
const product = new ProductDetails(productId, dataSource);
console.log("product", product);
product.init();
// console.log(dataSource.findProductById(productId));

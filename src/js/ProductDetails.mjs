import { getLocalStorage, qs, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
  // To make sure product has required properties
  if (!this.product || !this.product.Id) {
   // console.log("Invalid product data:", this.product);
    return;
  }
  
  const productCart = getLocalStorage("so-cart") || [];
  
  // Check if product already exists in cart
  const existingIndex = productCart.findIndex(item => item.Id === this.product.Id);
  
  if (existingIndex > -1) {
    // Update quantity if already in cart
    productCart[existingIndex].quantity = (productCart[existingIndex].quantity || 1) + 1;
  } else {
    // Add new product with quantity
    const productToAdd = {...this.product, quantity: 1};
    productCart.push(productToAdd);
  }
  
  setLocalStorage("so-cart", productCart);
//  console.log("Product added to cart:", this.product);
}
  renderProductDetails() {
    qs("h2").textcontent = this.product.Brand.Name;
    qs("h3").textcontent = this.product.Brand.NameWithoutBrand;

    qs("#product-img").src = this.product.Image;
    qs("#product-img").alt = this.product.NameWithoutBrand;
    qs(".product-card__price").textcontent = this.product.FinalPrice;
    qs(".product__color").textcontent = this.product.Colors[0].ColorName;
    qs(".product__description").innerHTML = this.product.DescriptionHtmlSimple;
    qs("#addToCart").dataset.id = this.product.Id;
    document.title = `Sleep outside ${this.product.Name}`;
  }
}

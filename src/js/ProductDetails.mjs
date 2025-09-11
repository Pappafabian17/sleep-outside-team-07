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
    const productCart = getLocalStorage("so-cart") || [];
    productCart.push(this.product);
    setLocalStorage("so-cart", productCart);
  }

  renderProductDetails() {
    qs("h2").textContent = this.product.Brand.Name;
    qs("h3").textContent = this.product.NameWithoutBrand;

    qs("#product-img").src = this.product.Image;
    qs("#product-img").alt = this.product.NameWithoutBrand;
    qs(".product-card__price").textContent = `$${this.product.FinalPrice}`;
    qs(".product__color").textContent = this.product.Colors[0].ColorName;
    qs(".product__description").innerHTML = this.product.DescriptionHtmlSimple;
    qs("#addToCart").dataset.id = this.product.Id;
    document.title = `Sleep Outside | ${this.product.Name}`;
  }
}
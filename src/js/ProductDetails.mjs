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
  }

  addProductToCart() {
    const productCart = getLocalStorage("so-cart") || [];
    productCart.push(this.product);
    setLocalStorage("so-cart", productCart);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }

}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  document.querySelector("#p-brand").textContent = product.Brand.Name;
  document.querySelector("#p-name").textContent = product.NameWithoutBrand;

  const productImage = document.querySelector("#p-image");
  productImage.src = product.Images.PrimaryExtraLarge;
  productImage.alt = product.NameWithoutBrand;

  // Calculate discount and format price with discount indicator
  const hasDiscount = product.SuggestedRetailPrice > product.FinalPrice;
  const euroPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(product.FinalPrice) * 0.85);

  let priceHTML = '';
  if (hasDiscount) {
    const discountPercentage = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    const originalEuroPrice = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(Number(product.SuggestedRetailPrice) * 0.85);

    priceHTML = `
      <span class="discount-badge">-${discountPercentage}% OFF</span>
      <span class="original-price">${originalEuroPrice}</span>
      <span class="sale-price">${euroPrice}</span>
    `;
  } else {
    priceHTML = euroPrice;
  }

  document.querySelector("#p-price").innerHTML = priceHTML;
  document.querySelector("#p-color").textContent = product.Colors[0].ColorName;
  document.querySelector("#p-description").innerHTML = product.DescriptionHtmlSimple;

  document.querySelector("#addToCart").dataset.id = product.Id;

  document.title += ` ${product.NameWithoutBrand}`;
}

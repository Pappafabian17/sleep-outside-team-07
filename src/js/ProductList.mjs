import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    // Calculate discount - ONLY NEW CODE ADDED HERE
    const hasDiscount = product.SuggestedRetailPrice > product.FinalPrice;
    const discountBadge = hasDiscount ?
        `<span class="card-discount-badge">-${Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)}%</span>` : '';

    return `<li class="product-card">
    <a href="../product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">${discountBadge}${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }
    async init() {
        const list = await this.dataSource.getData(this.category);
        this.renderList(list);
        document.querySelector(".title").textContent = this.category;
    }
    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}
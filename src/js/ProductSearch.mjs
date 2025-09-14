import { qs, textContains } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

function productSearchTemplate(product) {
  const imageUrl = product.Image || product.Images.PrimarySmall;
  return `<li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
          <img src="${imageUrl}" alt="${product.Name}">
          <h3 class="card__brand">${product.Brand.Name}</h3>
          <h2 class="card__name">${product.Name}</h2>
      </a>
  </li>`;
}

export default class ProductSearch {
  constructor() {
    this.productData = new ProductData();
    this.products = [];
    this.searchContainer = qs(".search");
    this.searchInput = qs("#search");
    this.resultsContainer = null;
  }

  async init() {
    this.products = await this.productData.findAllProducts();
    if (!this.products) {
      return;
    }

    this.resultsContainer = document.createElement("ul");
    this.resultsContainer.classList.add("product-list", "search-results");
    document.body.appendChild(this.resultsContainer);

    this.searchInput.addEventListener("input", () => this.performSearch());

    document.body.addEventListener("click", (e) => {
      if (!this.searchContainer.contains(e.target)) {
        this.hideResults();
      }
    });

    window.addEventListener("resize", () => {
      if (this.resultsContainer.style.display !== "none") {
        this.positionResults();
      }
    });
  }

  performSearch() {
    const query = this.searchInput.value.trim().toLowerCase();

    if (query.length < 3) {
      this.hideResults();
      return;
    }

    const filteredProducts = this.products.filter(
      (product) => textContains(product.Name, query) ||
        textContains(product.Brand?.Name, query) ||
        textContains(product.DescriptionHtmlSimple, query)
    );

    this.renderResults(filteredProducts);
  }

  renderResults(results) {
    this.resultsContainer.innerHTML = "";

    if (results.length === 0) {
      this.resultsContainer.innerHTML = "<li>No products found.</li>";
    } else {
      const resultsHtml = results
        .map((product) => productSearchTemplate(product))
        .join("");
      this.resultsContainer.innerHTML = resultsHtml;
    }
    this.positionResults();
    this.resultsContainer.style.display = "flex";
  }

  positionResults() {
    const inputRect = this.searchInput.getBoundingClientRect();
    this.resultsContainer.style.position = "absolute";
    this.resultsContainer.style.backgroundColor = "white";
    this.resultsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
    this.resultsContainer.style.left = `${inputRect.left + window.scrollX}px`;
    this.resultsContainer.style.width = `${this.searchInput.offsetWidth}px`;
    this.resultsContainer.style.maxHeight = "100vh";
    this.resultsContainer.style.overflowY = "auto";
  }

  hideResults() {
    this.resultsContainer.style.display = "none";
    this.resultsContainer.innerHTML = "";
  }
}

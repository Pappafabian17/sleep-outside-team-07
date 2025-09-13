function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // Path updated to reflect the new file structure from your last commit
    this.path = `../public/json/${this.category}.json`;
  }
  getData() {
    return fetch(this.path).then(convertToJson);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}

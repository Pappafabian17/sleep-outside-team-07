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
    if (this.category) {
      this.path = `../json/${this.category}.json`;
    }
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
  async findAllProducts() {
    const categories = ["tents", "sleeping-bags", "backpacks"];

    const promises = categories.map((category) =>
      fetch(`../json/${category}.json`)
        .then(convertToJson)
        .then((data) => data.Result || data)
    );
    const productArrays = await Promise.all(promises.map((p) => p.catch(() => [])));
    return productArrays.flat();
  }
}

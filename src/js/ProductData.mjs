const baseURL = import.meta.env.VITE_SERVER_URL

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
    constructor() {
      //this.category = category;
    }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category} `);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    //console.log(data.Result);
    return data.Result;
  }
  async findAllProducts() {
    const categories = ["tents", "sleeping-bags", "backpacks", "hammocks"];

    const promises = categories.map((category) =>
      fetch(`${baseURL}products/search/${category} `)
        .then(convertToJson)
        .then((data) => data.Result || data)
    );
    const productArrays = await Promise.all(promises.map((p) => p.catch(() => [])));
    return productArrays.flat();
  }
}

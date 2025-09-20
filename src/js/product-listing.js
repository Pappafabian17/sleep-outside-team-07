import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import ProductSearch from "./ProductSearch.mjs";
import { loadHeaderFooter, getParam, updateCartCount } from "./utils.mjs";

async function initPage() {
    // Primero, carga los elementos comunes como el encabezado y el pie de página
    await loadHeaderFooter();

    // Ahora que el encabezado está cargado, podemos inicializar la búsqueda y el carrito
    const productSearch = new ProductSearch();
    productSearch.init();
    updateCartCount();

    // Luego, inicializa la lista de productos específica de esta página
    const category = getParam("category");
    const dataSource = new ProductData();
    const listElement = document.querySelector(".product-list");

    const myList = new ProductList(category, dataSource, listElement);
    myList.init();
}

initPage();
import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

console.log("Checkout.js is loading...");

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".checkout-summary");
myCheckout.init();

console.log("CheckoutProcess initialized");

// Debug: Check if elements exist
const zipElement = document.querySelector("#zip");
const buttonElement = document.querySelector("#checkoutSubmit");

console.log("Zip element found:", zipElement);
console.log("Button element found:", buttonElement);

if (zipElement) {
    zipElement.addEventListener("blur", myCheckout.calculateOrderTotal.bind(myCheckout));
    console.log("Zip blur event listener added");
} else {
    console.error("Zip element not found!");
}

// listening for click on the button
if (buttonElement) {
    buttonElement.addEventListener("click", (e) => {
        console.log("Button clicked!");
        e.preventDefault();
        console.log("About to call checkout...");
        myCheckout.checkout();
    });
    console.log("Button click event listener added");
} else {
    console.error("Button element not found!");
}

// Alternative: Listen for form submit as backup
const form = document.forms['checkout'];
if (form) {
    form.addEventListener('submit', (e) => {
        console.log("Form submitted!");
        e.preventDefault();
        console.log("About to call checkout from form submit...");
        myCheckout.checkout();
    });
    console.log("Form submit event listener added");
} else {
    console.error("Form not found!");
}
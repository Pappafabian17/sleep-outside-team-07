import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        this.calculateItemSubTotal();
        this.calculateShipping();
        this.calculateOrderTotal();
    }

    calculateItemSubTotal() {
        const itemTotal = this.list.reduce(
            (acc, item) => acc + item.FinalPrice * (item.quantity || 1),
            0
        );

        this.itemTotal = itemTotal;
    }

    calculateOrderTotal() {

        this.calculateShipping();

        this.tax = this.itemTotal * 0.06;

        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        //render HTML
        this.displayOrderTotals();
    }

    calculateShipping() {
        const totalItems = this.list.reduce(
            (acc, item) => acc + (item.quantity || 1),
            0
        )

        let shippingCost = 0;

        if (totalItems > 0) {
            shippingCost += 10;

            const addtionalItems = totalItems - 1;
            if (addtionalItems > 0) {
                shippingCost += addtionalItems * 2;
            }
        }

        this.shipping = shippingCost;
    }

    displayOrderTotals() {
        //Sub Total
        const subTotalSummary = document.querySelector(".sub-total");
        if (subTotalSummary) {
            subTotalSummary.innerHTML = `Sub Total: <strong>$${this.itemTotal.toFixed(2)}</strong>`;
        }

        //Shipping
        const shippingSummary = document.querySelector(".shipping");
        if (shippingSummary) {
            shippingSummary.innerHTML = `Shipping Estimate: <strong>$${this.shipping.toFixed(2)}</strong>`;
        }

        //Tax
        const taxSummary = document.querySelector(".tax");
        if (taxSummary) {
            taxSummary.innerHTML = `Tax: <strong>$${this.tax.toFixed(2)}</strong>`;
        }

        //OrderTotal
        const orderTotalSummary = document.querySelector(".order-total");
        if (orderTotalSummary) {
            orderTotalSummary.innerHTML = `Order Total: <strong>$${this.orderTotal.toFixed(2)}</strong>`;
        }
    }
}


export function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');

    value = value.replace(/(\d{4})(?=\d)/g, '$1-')

    input.value = value.substring(0, 19);

    //input.value.replace(/-/g, '')
}

export function formatExpirationDate(input) {
    let value = input.value;

    let cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length === 1 && cleanValue > 1) {
        cleanValue = '0' + cleanValue;
    }

    if (cleanValue.length === 2 && cleanValue > 12) {
        cleanValue = '12';
    }

    if (cleanValue.length >= 3) {
        // Format: MM/YY
        cleanValue = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
    }

    input.value = cleanValue.substring(0, 5);


}
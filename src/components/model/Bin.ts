import { IProduct } from "../../types";

export class Bin {
    private productsForBuy: IProduct[];

    constructor() {
        this.productsForBuy = [];
    }

    get getProductForBuy() {
        return this.productsForBuy;
    }

    addProductForBuy(product: IProduct) {
        if (!product) {
            console.log('товар не из каталога');
            throw new Error('продукт не задан');
        }
        
        if(!product.price) {
            console.log('нет цены');
            throw new Error('товар не продается');
        }

        if(!this.checkProductById(product.id)) {
            this.productsForBuy.push(product);
        }
    }

    removeProductForBuy(product: IProduct) {
        if (product) {
            this.productsForBuy = this.productsForBuy.filter(item => item.id !== product.id);
        }
    }

    clearBin() {
        this.productsForBuy = [];
    }

    getBinCoast(): number {
        return this.productsForBuy.reduce((ac, product)=> ac + (product.price || 0), 0);
    }

    getBinProductCount(): number {
        return this.productsForBuy.length;
    }

    checkProductById(id: string): boolean {
        return this.productsForBuy.some(item => item.id === id);
    }

}
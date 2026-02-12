import { IProduct } from "../../types";
import { Events } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class Bin {
    private productsForBuy: IProduct[];

    constructor(private event: IEvents) {
        this.productsForBuy = [];
    }

    getProductForBuy() {
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
            this.event.emit(Events.BIN_CHANGED);
        }
        
    }

    removeProductForBuy(product: IProduct) {
        if (product) {
            this.productsForBuy = this.productsForBuy.filter(item => item.id !== product.id);
            this.event.emit(Events.BIN_CHANGED);
        }
    }

    clearBin() {
        this.productsForBuy = [];
        this.event.emit(Events.BIN_CHANGED);
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
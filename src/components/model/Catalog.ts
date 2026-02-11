import { IProduct } from "../../types";
import { Events } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class Catalog {
  private allProducts: IProduct[];
  private currentProduct: IProduct | null;
  private event: IEvents;

    constructor(event: IEvents ,allProducts: IProduct[]) {
        this.allProducts = allProducts;
        this.currentProduct = null;
        this.event = event;
    }

    saveProducts(products: IProduct[]) {
        this.allProducts = products;
        this.event.emit(Events.CATALOG_CHANGED);
    }

    getProducts(): readonly IProduct[] {
        return this.allProducts;
    }

    getProductById(id: string): IProduct | undefined{
        return this.allProducts.find(product => product.id === id);
    }

    saveProduct(currentProduct: IProduct | null) {
        this.currentProduct = currentProduct;
        this.event.emit(Events.CATALOG_CHANGED_SELECTED);
    }

    getProduct(): IProduct | null {
        return this.currentProduct;
    }
}
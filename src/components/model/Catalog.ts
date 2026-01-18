import { IProduct } from "../../types";

export class Catalog {
  private allProducts: IProduct[];
  private currentProduct: IProduct | undefined;
    constructor(allProducts: IProduct[]) {
        this.allProducts = allProducts;
        this.currentProduct = undefined;
    }

    saveProducts(allProducts: IProduct) {
        return this.allProducts.push(allProducts);
    }

    get getProducts(): IProduct[] {
        return this.allProducts;
    }

    getProductById(id: string): IProduct | undefined{
        return this.allProducts.find(product => product.id === id);
    }

    set saveProduct(currentProduct: IProduct) {
        this.saveProduct = currentProduct;
    }

    getProduct(): IProduct | undefined {
        return this.currentProduct;
    }
}
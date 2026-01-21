import { IProduct } from "../../types";

export class Catalog {
  private allProducts: IProduct[];
  private currentProduct: IProduct | null;
    constructor(allProducts: IProduct[]) {
        this.allProducts = allProducts;
        this.currentProduct = null;
    }

    saveProducts(products: IProduct[]) {
        this.allProducts = products;
    }

    getProducts(): readonly IProduct[] {
        return this.allProducts;
    }

    getProductById(id: string): IProduct | undefined{
        return this.allProducts.find(product => product.id === id);
    }

    saveProduct(currentProduct: IProduct | null) {
        this.currentProduct = currentProduct;
    }

    getProduct(): IProduct | null {
        return this.currentProduct;
    }
}
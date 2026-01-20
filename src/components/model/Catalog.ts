import { IProduct } from "../../types";

export class Catalog {
  private allProducts: IProduct[];
  private currentProduct: IProduct | undefined;
    constructor(allProducts: IProduct[]) {
        this.allProducts = allProducts;
        this.currentProduct = undefined;
    }

    set saveProducts(products: IProduct[]) {
        this.allProducts = products;
    }

    get getProducts(): readonly IProduct[] {
        return this.allProducts;
    }

    getProductById(id: string): IProduct | undefined{
        return this.allProducts.find(product => product.id === id);
    }

    set saveProduct(currentProduct: IProduct) {
        this.currentProduct = currentProduct;
    }

    get getProduct(): IProduct | undefined {
        return this.currentProduct;
    }
}
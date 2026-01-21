import { IApi, IOrder, IOrderResponse, IProductResponse } from "../../types";
import { API_ENDPOINT } from "../../utils/constants";

export class ApiClient {
    private api;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProductResponse> {
        return await this.api.get<IProductResponse>(API_ENDPOINT.PRODUCTS);
    }

    async makeOrder(order: IOrder): Promise<IOrderResponse> {
        return await this.api.post<IOrderResponse>(API_ENDPOINT.ORDER, order);
    }
}
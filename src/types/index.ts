export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = "online" | "offline" | undefined;

export type TValidate = {[key: string]: string};

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
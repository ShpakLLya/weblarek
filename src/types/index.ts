export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = "online" | "offline" | null;

export type TValidate = {[key: string]: string};

export type TCard = Pick<IProduct, 'title' | 'price'>;

export type TCardImage = {
  src: string
  alt: string
}

export type TCardCatalog = Pick<IProduct, 'category'> & {image: TCardImage};

export type ICardActions = {
  onclick: () => void
}

export type TCardBasket = Pick<IProduct, 'title' | 'price'> & {index: number};

export type TCardPreview = Omit<IProduct, 'image'> & {image: TCardImage} & {buttonText?: string};

export type TContacs = {
  errors: TValidate;
} & {phone: string, email: string};

export type TOrder = {
  errors: TValidate;
} & {buttonActive: TPayment, address: string}

export type TToggleButton = 'enable' | 'disable'

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

export interface IProductResponse {
  total: number,
  items: []
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IHeaderData {
  counter: number;
}

export interface IGalleryData {
  catalog: HTMLElement[];
}

export interface IModalData {
  content: HTMLElement | HTMLElement[];
}

export interface IBasketData {
  price: number;
  content: HTMLElement[];
}

export interface IOrderSuccessData {
  price: number;
}
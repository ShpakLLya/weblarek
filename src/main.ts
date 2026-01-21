import { Api } from './components/base/Api';
import { ApiClient } from './components/commutation/ApiClient';
import { Bin } from './components/model/Bin';
import { Buyer } from './components/model/buyer';
import { Catalog } from './components/model/Catalog';
import './scss/styles.scss';
import { IOrder, IProduct } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const data = apiProducts.items;

console.group('КАТАЛОГ ТОВАРОВ');
const productsModel = new Catalog(data);
console.log("Объект каталога продуктов", productsModel);
console.log("Список продуктов", productsModel.getProducts());

const newProducts = [...data, {
    "id": "154c3f69-976d-4a2a-a18c-2av45046c3x1",
    "description": "Тест",
    "image": "/Asterisk_2.svg",
    "title": "клавиатура с Али",
    "category": "софт-скил",
    "price": 1900
}]
console.log("Обновленный список продуктов", productsModel.saveProducts(newProducts));

productsModel.saveProduct(data[0]);
console.log('Выбранный продукт', productsModel.getProduct());

productsModel.saveProduct(null);
console.log('Снять выбор с продукта', productsModel.getProduct());

console.log('Получить товар по id', productsModel.getProductById(data[0]?.id));
console.log('Получить товар по несуществующему id', productsModel.getProductById('test'));
console.groupEnd();

console.group('КОРЗИНА');
const cart = new Bin();

console.group('Товар с ценой');
console.log('Изначально в корзине', [...cart.getProductForBuy()]);

try {
    cart.addProductForBuy(data[0]);
    cart.addProductForBuy(data[3]);
}
catch(er) {
    console.error(er);
}

console.log('Корзина после добавления', [cart.getProductForBuy()]);
console.groupEnd();

console.group('Добавление продукта, которого нет в данных (проверка на undefined)');
const cart1 = new Bin();
try {
    cart1.addProductForBuy(data[1]);
} catch (err) {
    console.log(err);
}

console.log('Продукты в корзине', [...cart1.getProductForBuy()]);
try {
    cart1.addProductForBuy(data[8]);
} catch (err) {
    console.log(err);
}
console.log('Продукты в корзине после добавление', cart1.getProductForBuy());
console.groupEnd();

console.group('Добавление в корзину товара без цены');
const cart2 = new Bin();
console.log('Продукты в корзине до', [...cart2.getProductForBuy()]);
try {
    cart2.addProductForBuy(data[2]);
} catch (err) {
    console.log(err);
}
 console.log(' Продукты в корзине после добавление товара без цены', cart2.getProductForBuy());
console.groupEnd();

console.group('Повторное добавление товара в корзину (товар можно добавить только раз)');
const cart3 = new Bin();
console.log('Продукты в корзине', [...cart3.getProductForBuy()]);
try {
    cart3.addProductForBuy(data[0]);
    cart3.addProductForBuy(data[0]);
} catch (err) {
    console.log(err);
}
console.log('Продукты в корзине после добавления дубля товара', cart3.getProductForBuy());
console.groupEnd();

console.group('Удаление товара');
const cart4 = new Bin();
try {
    cart4.addProductForBuy(data[0]);
    cart4.addProductForBuy(data[1]);
} catch (err) {
    console.log(err);
}
console.log('Продукты в корзине до удаления', [...cart4.getProductForBuy()]);
cart4.removeProductForBuy(data[0]);
console.log('Продукты в корзине после удаления', cart4.getProductForBuy());
console.groupEnd();

console.group('Удаление товара, которого нет в корзине');
const cart5 = new Bin();
try {
    cart5.addProductForBuy(data[1]);
} catch (err) {
    console.log(err);
}
console.log('Продуктов в корзине до удаления', cart5.getProductForBuy().length);
cart.removeProductForBuy(data[0]);
console.log('Продукты в корзине после удаления', cart5.getProductForBuy().length);
console.groupEnd();

console.group('Удаление продукта которого нет в данных (проверка на undefined)');
const cart6 = new Bin();
try {
    cart6.addProductForBuy(data[1]);
} catch (err) {
    console.log(err);
}
console.log('Продукты в корзине до удаления', cart6.getProductForBuy().length);
cart6.removeProductForBuy(data[9]);
console.log('Продукты в корзине после удаления', cart6.getProductForBuy().length);
console.groupEnd();

console.group('Очистка корзины')
const cart7 = new Bin();
try {
    cart7.addProductForBuy(data[0]);
    cart7.addProductForBuy(data[1]);
} catch (err) {
    console.log(err);
}
console.log('Продуктов в корзине до очистки', cart7.getProductForBuy().length);
cart7.clearBin();
console.log('Продуктов в корзине после полной очистки', cart7.getProductForBuy().length);
console.groupEnd();

console.group('Получение общей стоимости');
const cart8 = new Bin();
try {
    cart8.addProductForBuy(data[0]);
    cart8.addProductForBuy(data[1]);
} catch (err) {
    console.log(err);
}
console.log('Товары в корзине', cart8.getProductForBuy())
console.log('Ожидаемая общая стоимость', (data[0]?.price || 0) + (data[1]?.price || 0));
console.log('Фактическая общая стоимость', cart8.getBinCoast());
console.groupEnd();

console.group('Получение количества позиций');
const cart9 = new Bin();
try {
    cart9.addProductForBuy(data[0]);
    cart9.addProductForBuy(data[1]);
} catch (err) {
    console.log(err);
}
console.log('Товары в корзине', cart9.getProductForBuy())
console.log('Ожидаемое количество', 2);
console.log('Фактическое количество', cart8.getBinProductCount());
console.groupEnd();

console.group('Проверка наличия товара в корзине');
const cart10 = new Bin();
try {
    cart10.addProductForBuy(data[0]);
    cart10.addProductForBuy(data[1]);
} catch (err) {
    console.log(err);
}
console.log('Товары в корзине', cart10.getProductForBuy())
console.log(`Корзина содержит товар ${data[0]?.id}`, cart10.checkProductById(data[0]?.id));
console.log(`Корзина содержит товар ${data[2]?.id}`, cart10.checkProductById(data[2]?.id));
console.groupEnd();

console.group('ПОКУПАТЕЛЬ')
const customer = new Buyer();
console.log('Объект покупателя', customer);
customer.addPayment('offline');
console.log('Покупатель с оплатой при получении', {...customer.buyerInfo()});
customer.addPayment(null);
console.log('Покупатель с неустановленной оплатой', {...customer.buyerInfo()});
customer.addPayment('online');
console.log('Покупатель с оплатой онлайн', {...customer.buyerInfo()});

customer.addAddres('Moscow, Kremlin')
    .addPhone('+8 800 355 35 35')
    .addEmail('avtotest@ya.ru');
console.log('Покупатель со всеми данными', {...customer.buyerInfo()});
console.log('Валидация покупателя', customer.validate());
customer.clear();
console.log('Покупатель после очистки данных', {...customer.buyerInfo()});
console.log('Валидация покупателя', customer.validate())
console.groupEnd();

const api = new Api(API_URL);
const client = new ApiClient(api);


async function init() {
    const data = await client.getProducts();
    const data1: IProduct[] = data.items;
    return data1;
}

async function postOrder(order: IOrder) {
    await client.makeOrder(order);
    console.log('succesfull post');
}

init().then((result) => {console.log('Товары с сервера', result)}).catch((e) => console.error(e));

const order: IOrder = {
    "payment": "online",
    "email": "ya@ya.ru",
    "phone": "+77777777777",
    "address": "HRG Sallam Abad 3",
    "total": 11500,
    "items": [
        "f3867296-45c7-4603-bd34-29cea3a061d5",
        "48e86fc0-ca99-4e13-b164-b98d65928b53"
    ]
}
const orderWrongTotal:IOrder = {
    "payment": "online",
    "email": "ya@ya.ru",
    "phone": "+77777777777",
    "address": "HRG Sallam Abad 3",
    "total": 2200,
    "items": [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
        '90973ae5-285c-4b6f-a6d0-65d1d760b102'
    ]
}

const orderWrongProduct:IOrder = {
    "payment": "online",
    "email": "ya@ya.ru",
    "phone": "+77777777777",
    "address": "HRG Sallam Abad 3",
    "total": 2200,
    "items": [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
        '90973ae5-285c-4b6f-a6d0-65d1d760b105'
    ]
}

const orderWrongAddress:IOrder = {
    "payment": "online",
    "email": "ya@ya.ru",
    "phone": "+77777777777",
    "address": "",
    "total": 2200,
    "items": [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
        '90973ae5-285c-4b6f-a6d0-65d1d760b105'
    ]
}

const orderWithUndefinedPayment: IOrder = {
    "payment": null,
    "email": "ya@ya.ru",
    "phone": "+77777777777",
    "address": "",
    "total": 2200,
    "items": [
        "854cef69-976d-4c2a-a18c-2aa45046c390",
        "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
        '90973ae5-285c-4b6f-a6d0-65d1d760b105'
    ]
}

postOrder(order).catch((e) => console.error(e));

postOrder(orderWrongTotal).catch((e) => console.error(e));

postOrder(orderWrongProduct).catch((e) => console.error(e));

postOrder(orderWrongAddress).catch((e) => console.error(e));

postOrder(orderWithUndefinedPayment).catch((e) => console.error(e));
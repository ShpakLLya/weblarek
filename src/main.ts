import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ApiClient } from './components/commutation/ApiClient';
import { Bin } from './components/model/Bin';
import { Buyer } from './components/model/buyer';
import { Catalog } from './components/model/Catalog';
import { Basket } from './components/view/Basket';
import { CardBasket } from './components/view/card/CardBasket';
import { CardCatalog } from './components/view/card/CardCatalog';
import { CardPreview } from './components/view/card/CardPreview';
import { Gallery } from './components/view/Gallery';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { Contacs } from './components/view/order/Contacts';
import { Order } from './components/view/order/Order';
import { OrderSuccess } from './components/view/order/OrderSucces';
import './scss/styles.scss';
import { IBuyer, IOrder, IProduct, TCardPreview, TValidate } from './types';
import { API_URL, Events } from './utils/constants';
import { cloneTemplate, ensureElement, filterErrors } from './utils/utils';

const api = new Api(API_URL);
const clientApi = new ApiClient(api);

const events = new EventEmitter();

const catalog = new Catalog(events, []);
const bin = new Bin(events);
const buyer = new Buyer(events);

const gallery = new Gallery(ensureElement('.gallery'));
const popup = new Modal(ensureElement('#modal-container'));
const header = new Header(events, ensureElement('.header'));
const basket = new Basket(events, cloneTemplate('#basket'));
const cardPreview = new CardPreview(cloneTemplate('#card-preview'), events);
const orderForm = new Order(events, cloneTemplate('#order'));
const contactsForm = new Contacs(events, cloneTemplate('#contacts'));
const successForm = new OrderSuccess(events, cloneTemplate('#success'));

// Инициализация состояния кнопки корзины
basket.toggleButton('disable');

const orderStepErrors = ['address', 'payment'];
const contactsStepErrors = ['phone', 'email'];

events.on(Events.CATALOG_CHANGED, () => {
    const itemsCards = catalog.getProducts()
        .map(item => {
            const card = new CardCatalog(cloneTemplate('#card-catalog'), {
                onclick: () => {
                    events.emit(Events.CARD_OPEN, item);
                }
            });
            return card.render({...item, image: {src: item.image, alt: item.title}});
        });
    return gallery.render({catalog: itemsCards});
})

events.on(Events.CATALOG_CHANGED_SELECTED, () => {
    const currentProduct: IProduct = catalog.getProduct() as IProduct;
    const item: TCardPreview = {...currentProduct, image: {src: currentProduct.image, alt: currentProduct.title}};

    if(!currentProduct.price) {
        item['buttonText'] = 'Недоступно';
        cardPreview.toggleButton('disable');
    } else if(!bin.checkProductById(currentProduct.id)) {
        item['buttonText'] = 'Купить';
        cardPreview.toggleButton('enable');
    } else if (bin.checkProductById(currentProduct.id)) {
        item['buttonText'] = 'Удалить из корзины';
        cardPreview.toggleButton('enable');
    }

    popup.render({content: cardPreview.render(item)});
    popup.open();
});

events.on(Events.BIN_CHANGED, () => {
    header.render({ counter: bin.getBinProductCount()});
    bin.getBinProductCount() ? basket.toggleButton('enable') : basket.toggleButton('disable');
    const renderedItems = renderBasketCards(bin);
    basket.render({price: bin.getBinCoast(), content: renderedItems});
});

events.on(Events.BUYER_CHANGED, () => {
    const errors: TValidate = buyer.validate();
    const orderFormErrors = filterErrors(errors, orderStepErrors);
    const contactsFormErrors = filterErrors(errors, contactsStepErrors);

    orderForm.render({
        errors: orderFormErrors,
        buttonActive: buyer.buyerInfo().payment,
        address: buyer.buyerInfo().address
    });

    contactsForm.render({
        errors: contactsFormErrors,
        phone: buyer.buyerInfo().phone,
        email: buyer.buyerInfo().email
    });

    Object.keys(orderFormErrors).length !== 0 ? orderForm.toggleNextButton('disable') : orderForm.toggleNextButton('enable');

    Object.keys(contactsFormErrors).length !== 0 ? contactsForm.toggleNextButton('disable') : contactsForm.toggleNextButton('enable');
    
});

events.on(Events.BASKET_OPEN, () => {
    popup.render({content: basket.render()});
    popup.open();
});

events.on(Events.CARD_BUTTON_CLICK, () => {
    const currentProduct: IProduct = catalog.getProduct() as IProduct;
    bin.checkProductById(currentProduct.id) ? events.emit(Events.BASKET_REMOVE_ITEM, currentProduct) : events.emit(Events.BASKET_ADD_ITEM, currentProduct);
    popup.close();
});

events.on(Events.CARD_OPEN, (data: IProduct) => {
    catalog.saveProduct(data);
});

events.on(Events.BASKET_ADD_ITEM, (data: IProduct) => {
    bin.addProductForBuy(data);
});

events.on(Events.BASKET_REMOVE_ITEM, (item: IProduct) => {
    bin.removeProductForBuy(item);
});

events.on(Events.FORM_CHANGE, (data: IBuyer) => {
    if (data.payment !== undefined) buyer.addPayment(data.payment);
    if (data.email !== undefined) buyer.addEmail(data.email);
    if (data.phone !== undefined) buyer.addPhone(data.phone);
    if (data.address !== undefined) buyer.addAddres(data.address);
});

events.on(Events.ORDER_CHECKOUT, () => {
    const errors: TValidate = buyer.validate();
    const orderFormErrors = filterErrors(errors, orderStepErrors);
    const buyerData = buyer.buyerInfo();
    const isFormFilled = buyerData.address || buyerData.payment;

    const renderedOrderForm = orderForm.render({
        errors: isFormFilled ? orderFormErrors : {}
    });
    popup.render({content: renderedOrderForm});
});

events.on(Events.ORDER_PROCEED, () => {
    const errors: TValidate = buyer.validate();
    const contactsFormErrors = filterErrors(errors, contactsStepErrors);
    const buyerData = buyer.buyerInfo();
    const isFormFilled = buyerData.phone || buyerData.email;

    const renderContactsForm = contactsForm.render({
        errors: isFormFilled ? contactsFormErrors : {}
    });
    popup.render({content: renderContactsForm});
});

events.on(Events.ORDER_PAY, () => {
    const order: IOrder = {
        ...buyer.buyerInfo(),
        total: bin.getBinCoast(),
        items: bin.getProductForBuy().map(item => item.id)
    }

    clientApi.makeOrder(order)
        .then(data => {
            const renderedForm = successForm.render({price: data.total});
            popup.render({content: renderedForm});

            bin.clearBin();
            buyer.clear();
        })
        .catch(err => contactsForm.render({errors: {err}}));
});

events.on(Events.ORDER_SUCCESS, () => {
    popup.close();
});

clientApi.getProducts()
    .then(data => {
        catalog.saveProducts(data.items);
    })
    .catch (err => console.error(err));

const renderBasketCards = (bin: Bin): HTMLElement[] => {
    const binProducts = bin.getProductForBuy();
    return binProducts.map((item, index) => {
        const card = new CardBasket(cloneTemplate('#card-basket'), {
            onclick: () => {
                events.emit(Events.BASKET_REMOVE_ITEM, item);
            }
        });
        return card.render({...item, index: index + 1});
    })
}
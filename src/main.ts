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

const gallery = new Gallery(ensureElement('.page'));
const popup = new Modal(ensureElement('#modal-container'));
const header = new Header(events, ensureElement('.header'));
const basket = new Basket(events, cloneTemplate('#basket'));
const orderForm = new Order(events, cloneTemplate('#order'));
const contactsForm = new Contacs(events, cloneTemplate('#contacts'));
const successForm = new OrderSuccess(events, cloneTemplate('#success'));

let renderedBasket: HTMLElement;

let orderFormVisited = false;
let contactsFormVisited = false;
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
    const card = new CardPreview(cloneTemplate('#card-preview'), {
        onclick: () =>{
            bin.checkProductById(currentProduct.id) ? events.emit(Events.BASKET_REMOVE_ITEM, currentProduct) : events.emit(Events.BASKET_ADD_ITEM, currentProduct);
            popup.close();
        }
    });

    if(!currentProduct.price) {
        item['buttonText'] = 'Недоступно';
        card.disableButton();
    } else if(!bin.checkProductById(currentProduct.id)) {
        item['buttonText'] = 'Купить';
    } else if (bin.checkProductById(currentProduct.id)) {
        item['buttonText'] = 'Удалить из корзины';
    }

    const renderCard = card.render(item);
    popup.render({content: renderCard});
    popup.open();
});

events.on(Events.BIN_CHANGED, () => {
    header.render({ counter: bin.getBinProductCount()});
    bin.getBinProductCount() ? basket.enableButton : basket.disableButton();
    const renderedItems = renderBasketCards(bin);
    renderedBasket = basket.render({price: bin.getBinCoast(), content: renderedItems});
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

    Object.keys(orderFormErrors).length !== 0 ? orderForm.disableNextButton() : orderForm.enableNextButton();

    Object.keys(contactsFormErrors).length !== 0 ? contactsForm.disableNextButton() : contactsForm.enableNextButton();
    
});

events.on(Events.BASKET_OPEN, () => {
    popup.render({content: renderedBasket});
    popup.open();
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
    buyer.buyerAdd({...buyer.buyerInfo(), ...data});
});

events.on(Events.ORDER_CHECKOUT, () => {
    const errors: TValidate = buyer.validate();
    const orderFormErrors = filterErrors(errors, orderStepErrors);

    const renderedOrderForm = orderForm.render({
        errors: orderFormVisited ? orderFormErrors : {}
    });
    popup.render({content: renderedOrderForm});
    orderFormVisited = true;
});

events.on(Events.ORDER_PROCEED, () => {
    const errors: TValidate = buyer.validate();
    const contactsFormErrors = filterErrors(errors, contactsStepErrors);

    const renderContactsForm = contactsForm.render({
        errors: contactsFormVisited ? contactsFormErrors : {}
    });
    popup.render({content: renderContactsForm});
    contactsFormVisited = true;
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

            orderFormVisited = false;
            contactsFormVisited = false;
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
import { IBasketData } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Basket extends Component<IBasketData> {
    private priceElement: HTMLElement;
    private checkButtonElement: HTMLButtonElement;
    private contentElement: HTMLElement;

    constructor(private event: IEvents, protected readonly container: HTMLElement) {
        super(container);

        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.checkButtonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.contentElement = ensureElement<HTMLElement>('.basket__list', this.container);

        this.checkButtonElement.addEventListener('click', ()=> {
            this.event.emit(Events.ORDER_CHECKOUT);
        })
    }

    disableButton() {
        this.checkButtonElement.setAttribute('disabled', 'disabled');
    }

    enableButton() {
        this.checkButtonElement.removeAttribute('disabled');
    }

    set price(value: number) {
        this.priceElement.textContent = value.toString();
    }

    set content(items: HTMLElement[]) {
        items ? this.contentElement.replaceChildren(...items) : this.contentElement.textContent = 'Корзина пуста';
    }
    
}
import { IOrderSuccessData } from "../../../types";
import { Events } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export class OrderSuccess extends Component<IOrderSuccessData> {
    private priceElement: HTMLElement;
    private closeButtonElement: HTMLButtonElement;

    constructor(private event: IEvents, container:HTMLElement) {
        super(container);

        this.priceElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButtonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeButtonElement.addEventListener('click', ()=> {
            this.event.emit(Events.ORDER_SUCCESS)
        })
    }

    set price(value: number) {
        this.priceElement.textContent = `Списано ${value} синапсов`
    }
}
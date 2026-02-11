import { IHeaderData } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Header extends Component<IHeaderData> {
    private binButtonElement: HTMLButtonElement;
    private counterElement: HTMLElement;

    constructor (private event: IEvents, protected readonly container: HTMLElement) {
        super(container);
    
        this.event = event;
        this.binButtonElement = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.binButtonElement.addEventListener('click', ()=> {
            this.event.emit(Events.BASKET_OPEN);
        })
    }

    set counter(value: number) {
        this.counterElement.textContent = value.toString();
    }

}
import { ICardActions, TCardBasket } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

export class CardBasket extends Card<TCardBasket> {
    private deleteButtonElement: HTMLButtonElement;
    private indexElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);

        if(actions?.onclick) {
            this.deleteButtonElement.addEventListener('click', actions.onclick);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = value.toString();
    }
}
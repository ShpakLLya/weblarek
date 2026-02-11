import { TCard } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export abstract class Card<T> extends Component<T & TCard> {
    protected titleElement: HTMLHeadingElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container)

        this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number) {
        this.priceElement.textContent = value ? `${value} синапсов` : `Бесценно`;
    }
}
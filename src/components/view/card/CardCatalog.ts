import { ICardActions, TCardCatalog, TCardImage } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

export class CardCatalog extends Card<TCardCatalog> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if(actions?.onclick) {
            this.container.addEventListener('click', actions.onclick);
        }
    }

    set category(value: keyof typeof categoryMap) {
        this.categoryElement.classList.add(categoryMap[value]);
        this.categoryElement.textContent = value;
    }

    set image(value: TCardImage) {
        this.setImage(this.imageElement, CDN_URL + value.src, value.alt);
    }

}
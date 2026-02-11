import { ICardActions, TCardImage, TCardPreview } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

export class CardPreview extends Card<TCardPreview> {
    private descriptionElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onclick) {
            this.buttonElement.addEventListener('click', actions.onclick);
        }
    }

    disableButton() {
        this.buttonElement.setAttribute('disabled', 'disabled');
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set category(value: keyof typeof categoryMap) {
        this.categoryElement.classList.add(categoryMap[value]);
        this.categoryElement.textContent = value;
    }

    set image(value: TCardImage) {
        this.setImage(this.imageElement, CDN_URL + value.src, value.alt);
    }
}
import { ICardActions, TCardImage, TCardPreview, TToggleButton } from "../../../types";
import { categoryMap, CDN_URL, Events } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card } from "./Card";

export class CardPreview extends Card<TCardPreview> {
    private descriptionElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, private events: IEvents, actions?: ICardActions) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit(Events.CARD_BUTTON_CLICK);
        });

        if (actions?.onclick) {
            this.buttonElement.addEventListener('click', actions.onclick);
        }
    }

    

    toggleButton(condition: TToggleButton) {
        
        if(condition === 'disable') {
            this.buttonElement.setAttribute('disabled', 'disabled');
        } else {
            this.buttonElement.removeAttribute('disabled');
            }
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
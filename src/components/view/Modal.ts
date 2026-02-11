import { IModalData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Modal extends Component<IModalData> {
    private closeButtonElement: HTMLButtonElement;
    private contentElement: HTMLElement;

    constructor(protected readonly container: HTMLElement) {
        super(container);

        this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

        this.closeButtonElement.addEventListener('click', () => this.close());
        this.container.addEventListener('mousedown', (event) => {
            if (event.target === event.currentTarget) {
                this.close();
            }
        });
    }

    set content(data: HTMLElement) {
        this.contentElement.replaceChildren(data);
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.handleEscClose);
    }

    close() {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this.handleEscClose);
    }

    private handleEscClose = (event: KeyboardEvent)=> {
        if (event.key === "Escape") {
            this.close();
        }
    };
}
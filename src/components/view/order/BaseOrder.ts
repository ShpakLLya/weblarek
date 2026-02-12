import { TToggleButton, TValidate } from "../../../types";
import { Events } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export abstract class BaseOrder<T> extends Component<T> {
    protected errorsElement: HTMLElement;
    protected nextButtonElement: HTMLButtonElement;

    constructor(protected events: IEvents, protected readonly container: HTMLElement) {
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.nextButtonElement = ensureElement<HTMLButtonElement>('.modal__actions button[type = "submit"]', this.container);

        this.container.addEventListener('input', this.inputHandler);
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.onSubmit();
        });
    }

    protected onSubmit(): void {
        // Переопределяется в дочерних классах
    }

    set errors(messages: TValidate) {
        this.errorsElement.textContent = Object.values(messages).join('\n');
    }

    inputHandler = (e: Event) => {
        const target = e.target;
        if(target instanceof HTMLInputElement) {
            this.events.emit(Events.FORM_CHANGE, {[target.name]: (target.value)});
        }
    }

    toggleNextButton(condition: TToggleButton) {
        if(condition === 'disable') {
            this.nextButtonElement.setAttribute('disabled', 'disabled');
        }

        if(condition === 'enable') {
            this.nextButtonElement.removeAttribute('disabled');
        }
    }

} 
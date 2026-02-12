import { TContacs } from "../../../types";
import { Events } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { BaseOrder } from "./BaseOrder";

export class Contacs extends BaseOrder<TContacs> {
    private phoneElement: HTMLInputElement;
    private emeilElement: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.emeilElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    }

    protected onSubmit(): void {
        this.events.emit(Events.ORDER_PAY);
    }

    set phone(value: string) {
        this.phoneElement.value = value;
    }

    set email(value: string) {
        this.emeilElement.value = value;
    }
}
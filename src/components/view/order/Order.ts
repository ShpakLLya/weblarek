import { TOrder } from "../../../types";
import { Events, paymentMethods } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { BaseOrder } from "./BaseOrder";

export class Order extends BaseOrder<TOrder> {
    private paymentButtonContainer: HTMLElement;
    private addressElement: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.paymentButtonContainer = ensureElement<HTMLElement>('.order__buttons', this.container);
        this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.nextButtonElement.addEventListener('click', (e)=> {
            e.preventDefault();
            this.events.emit(Events.ORDER_PROCEED);
        });

        this.container.addEventListener('input', this.inputHandler);
        this.paymentButtonContainer.addEventListener('click', (e)=>{
            const currentButton = (e.target as HTMLElement).closest('button');
            if(!currentButton) return;

            this.events.emit(Events.FORM_CHANGE, {payment: paymentMethods[currentButton.name]});
        })
        
    }
    set buttonActive(paymentType: string) {
        const buttonName = Object.keys(paymentMethods).find(key => paymentMethods[key] === paymentType);
        Array.from(this.paymentButtonContainer.children).forEach(button => {
            button.classList.remove('button_alt-active');
            if((button as HTMLButtonElement).name === buttonName) {
                button.classList.add('button_alt-active');
            }
        })
    }

    set address(value: string) {
        this.addressElement.value = value;
    }
}
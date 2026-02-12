import { IBuyer, TPayment, TValidate } from "../../types";
import { Events, validationMessage } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class Buyer {
    private buyer: IBuyer;
    constructor(private event: IEvents) {
        this.buyer = {
            payment: null,
            address:'',
            phone: '',
            email: ''
        }
    }

    addPayment(type: TPayment) {
        this.buyer.payment = type;
        this.event.emit(Events.BUYER_CHANGED);
        return this;
    }

    addAddres(address: string) {
        this.buyer.address = address;
        this.event.emit(Events.BUYER_CHANGED);
        return this;
    }

    addPhone(number: string) {
        this.buyer.phone = number;
        this.event.emit(Events.BUYER_CHANGED);
        return this;
    }

    addEmail(email: string) {
        this.buyer.email = email;
        this.event.emit(Events.BUYER_CHANGED);
        return this;
    }

    buyerInfo(): IBuyer {
        return this.buyer;
    }

    clear() {
        this.buyer.payment = null;
        this.buyer.address = '';
        this.buyer.phone = '';
        this.buyer.email =  '';
        this.event.emit(Events.BUYER_CHANGED);
    }

    validate(): TValidate {
        const errors: TValidate = {};
        if (!this.buyer.payment) {
            errors.payment = validationMessage.payment;
        }

        if (this.buyer.address === '') {
            errors.address = validationMessage.address;
        }

        if (this.buyer.phone === '') {
            errors.phone = validationMessage.phone;
        }

        if (this.buyer.email === '') {
            errors.email = validationMessage.email;
        }
        return errors;
    }
}
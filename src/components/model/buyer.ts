import { IBuyer, TPayment, TValidate } from "../../types";
import { validationMessage } from "../../utils/constants";

export class Buyer {
    private buyer: IBuyer;
    constructor() {
        this.buyer = {
            payment: null,
            address:'',
            phone: '',
            email: ''
        }
    }

    addPayment(type: TPayment) {
        this.buyer.payment = type;
        return this;
    }

    addAddres(address: string) {
        this.buyer.address = address;
        return this;
    }

    addPhone(number: string) {
        this.buyer.phone = number;
        return this;
    }

    addEmail(email: string) {
        this.buyer.email = email;
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
    }

    validate(): TValidate {
        const errors: TValidate = {};
        if (this.buyer.payment !== 'online' || this.buyer.payment !== 'online') {
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
import { IBuyer, TPayment, TValidate } from "../../types";
import { validationMessage } from "../../utils/constants";

export class Buyer {
    buyer: IBuyer;
    constructor() {
        this.buyer = {
            payment: undefined,
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
        this.buyer.payment = undefined;
        this.buyer.address = '';
        this.buyer.phone = '';
        this.buyer.email =  '';
    }

    validate(): TValidate {
        const errors: TValidate = {};
        for (const key in this.buyer) {
            if(!this.buyer[key as keyof IBuyer]) {
                errors[key] = validationMessage[key];
            }
        }
        return errors;
    }
}
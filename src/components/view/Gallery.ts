import { IGalleryData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Gallery extends Component<IGalleryData> {
    private catalogElement: HTMLElement;

    constructor(protected readonly container: HTMLElement) {
        super(container);
        this.catalogElement = ensureElement<HTMLElement>('.gallery')
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.append(...items)
    }
}
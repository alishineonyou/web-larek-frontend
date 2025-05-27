import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IModelData {
	content: HTMLElement;
}

export class Modal extends Component<IModelData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (evt) => evt.stopPropagation());
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this._content.replaceChildren();
		this.events.emit('modal:close');
	}

	render(data: Partial<IModelData>): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	get content(): HTMLElement {
		return this._content;
	}
}

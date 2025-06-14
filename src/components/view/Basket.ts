import { Component } from '../base/Component';
import { IBasket } from '../../types';
import { createElement, handlePrice } from '../../utils/utils';
import { IEvents } from '../base/events';
import { BasketModel } from '../model/BasketModel';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this._button = container.querySelector(`.${blockName}__button`);
		this._total = container.querySelector(`.${blockName}__price`);
		this._list = container.querySelector(`.${blockName}__list`);

		if (this._button) {
			this._button.addEventListener('click', () => events.emit('basket:order'));
		}
	}

	set total(value: number | null) {
		this.setText(this._total, handlePrice(value) + ' синапсов');
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this._button.disabled = false;
		} else {
			this._list.replaceChildren(
				createElement('p', { textContent: 'Корзина пустая' })
			);
			this._button.disabled = true;
		}
	}

	render(data?: Partial<BasketModel>): HTMLElement {
		if (!data.items.length) {
			this.items = [];
		}
		this.total = data.total;
		return this.container;
	}
}

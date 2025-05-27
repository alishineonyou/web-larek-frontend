import { Component } from '../base/Component';
import { IActions, IBasketItem } from '../../types';
import { ensureElement, handlePrice } from '../../utils/utils';

export class BasketItem extends Component<IBasketItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _basketIndex: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(
		protected basketIndex: number,
		protected blockName: string,
		container: HTMLElement,
		protected actions?: IActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(
			`.${blockName}__title`,
			this.container
		);
		this._price = ensureElement<HTMLElement>(
			`.${blockName}__price`,
			this.container
		);
		this._basketIndex = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			`.${blockName}__button`,
			this.container
		);
		this._basketIndex.textContent = String(basketIndex);
		if (actions) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		this._price.textContent = String(value) + ' синапсов';
	}

	set deleteButton(value: HTMLButtonElement) {
		this._deleteButton = value;
	}
}

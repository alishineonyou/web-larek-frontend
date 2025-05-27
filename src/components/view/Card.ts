import { Component } from '../base/Component';
import { CategoryType, IActions, IProduct } from '../../types';
import { categorySelectors, CDN_URL } from '../../utils/constants';
import { ensureElement, handlePrice } from '../../utils/utils';

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
	) {
		super(container);

		this._title = container.querySelector(`.${blockName}__title`);
		this._image = container.querySelector(`.${blockName}__image`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${this.blockName}__text`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	switchButtonText(item: IProduct) {
		this.setText(
			this._button,
			item.inBasket ? 'Убрать из корзины' : 'В корзину'
		);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, CDN_URL + value, this.title);
		}
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? handlePrice(value) + ' синапсов' : 'Бесценно'
		);

		// блокируем кнопку добавления в корзину для бесценного товара
		if (this._button && value === null) {
			this._button.disabled = true;
		}
	}

	set category(value: CategoryType) {
		if (this._category) {
			this.setText(this._category, value);
			this._category.classList.add(categorySelectors[value]);
		}
	}

	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}
}

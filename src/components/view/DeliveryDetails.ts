import { IDeliveryDetails } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Form } from './Form';
import { IEvents } from '../base/events';

export class DeliveryDetails extends Form<IDeliveryDetails> {
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._cardButton = ensureElement<HTMLButtonElement>(
			'.button_alt[name=card]',
			container
		);
		this._cashButton = ensureElement<HTMLButtonElement>(
			'.button_alt[name=cash]',
			container
		);
		this._addressInput = container.querySelector(`.form__input`);

		this._addressInput.addEventListener('click', () => {
			this.onInputChange('address', this._addressInput.value);
		});

		[this._cardButton, this._cashButton].forEach((button: HTMLButtonElement) => {
			button.addEventListener('click', () => {
				this._handlePaymentClick(button);
				this.onInputChange('payment', button.name);
			});
		});
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

	private _handlePaymentClick(clickedButton: HTMLButtonElement): void {
		[this._cardButton, this._cashButton].forEach((btn) => {
			btn.classList.toggle('button_alt-active', btn === clickedButton);
		});
	}
}
